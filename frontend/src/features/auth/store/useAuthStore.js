import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    login as loginRequest,
    register as registerRequest,
    forgotPassword as forgotPasswordRequest,
    verifyEmail as verifyEmailRequest,
    resetPassword as resetPasswordRequest,
    refreshSession as refreshSessionRequest,
    updateProfilePicture as updateProfilePictureRequest,
} from "../../../shared/api"

const isExpired = (expiresAt, token) => {
    if (expiresAt) {
        const t = new Date(expiresAt).getTime();
        if (!Number.isNaN(t)) return t <= Date.now();
    }
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1] || ""));
            if (payload?.exp) return payload.exp * 1000 <= Date.now();
        } catch {
            return false;
        }
    }
    return false;
};

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            expiresAt: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            isLoadingAuth: true,

            checkAuth: () => {
                const { token, expiresAt } = get();

                if (!token || isExpired(expiresAt, token)) {
                    set({
                        user: null,
                        token: null,
                        expiresAt: null,
                        isAuthenticated: false,
                        isLoadingAuth: false,
                        loading: false
                    });
                    return;
                }

                set({
                    isLoadingAuth: false,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    expiresAt: null,
                    isAuthenticated: false
                })
            },

            register: async (formData) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await registerRequest(formData);
                    set({ loading: false });
                    return {
                        success: true,
                        emailVerificationRequired: data?.emailVerificationRequired,
                        data
                    }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al registrarse";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            requestPasswordReset: async (email) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await forgotPasswordRequest(email);
                    set({ loading: false });
                    return { success: true, data }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al solicitar restablecimiento de contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            resetPassword: async ({ token, newPassword }) => {
                try {
                    set({ loading: true, error: null });
                    await resetPasswordRequest(token, newPassword);
                    set({ loading: false });
                    return { success: true }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al restablecer la contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            verifyEmail: async (token) => {
                try {
                    set({ loading: true, error: null });
                    await verifyEmailRequest(token);
                    set({ loading: false });
                    return { success: true }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al verificar el correo";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            login: async ({ emailOrUsername, password }) => {
                try {
                    set({ loading: true, error: null });

                    const { data } = await loginRequest({ emailOrUsername, password })

                    const accessToken = data.accessToken ?? data.token;
                    const userDetails = data.userDetails;

                    set({
                        user: userDetails,
                        token: accessToken,
                        expiresAt: data.expiresAt,
                        loading: false,
                        isAuthenticated: Boolean(accessToken),
                        isLoadingAuth: false,
                    })

                    return { success: true }

                } catch (err) {
                    const message =
                        err.response?.data?.message || "Error de autenticación";
                    set({ error: message, loading: false })
                    return { success: false, error: message }
                }
            },

            refreshSession: async () => {
                const { token, isAuthenticated } = get();
                if (!token || !isAuthenticated) {
                    return { success: false, unsupported: false };
                }

                try {
                    const { data } = await refreshSessionRequest();
                    const accessToken = data.accessToken ?? data.token;
                    if (!accessToken) {
                        return { success: false };
                    }

                    set({
                        token: accessToken,
                        expiresAt: data.expiresAt,
                        user: data.userDetails || get().user,
                        isAuthenticated: true,
                        isLoadingAuth: false,
                    });

                    return { success: true };
                } catch (err) {
                    const status = err.response?.status;
                    if (status === 404) {
                        return { success: false, unsupported: true };
                    }
                    return { success: false, error: err.response?.data?.message };
                }
            },

            updateProfilePicture: async (formData) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await updateProfilePictureRequest(formData);
                    set({ user: { ...get().user, ...data.data }, loading: false });
                    return { success: true };
                } catch (err) {
                    const message = err.response?.data?.message || "Error al actualizar la foto de perfil";
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
            },

            setError: (error) => {
                set({ error: null });
                setTimeout(() => set({ error }), 10);
            },
            clearError: () => set({ error: null })
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                expiresAt: state.expiresAt,
                isAuthenticated: state.isAuthenticated
            }),
            merge: (persistedState, currentState) => ({
                ...currentState,
                ...persistedState,
                error: null,
                loading: false
            })
        }
    )
)
