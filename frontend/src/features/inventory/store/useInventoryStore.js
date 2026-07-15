import { create } from "zustand";
import {
  getProducts,
  searchProducts,
  createEntry,
  createOutput,
} from "../../../shared/api/inventory";

export const useInventoryStore = create((set, get) => ({
  products: [],
  loading: false,
  submitting: false,
  error: null,

  fetchStock: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await getProducts();
      set({ products: data.products || [], loading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo cargar el inventario";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  searchStock: async ({ name, category }) => {
    try {
      set({ loading: true, error: null });
      if (!name && !category) {
        return get().fetchStock();
      }
      const { data } = await searchProducts({
        ...(name ? { name } : {}),
        ...(category ? { category } : {}),
      });
      set({ products: data.products || [], loading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo filtrar el inventario";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  registerEntry: async (payload) => {
    try {
      set({ submitting: true, error: null });
      await createEntry(payload);
      set({ submitting: false });
      await get().fetchStock();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo registrar la entrada";
      set({ error: message, submitting: false });
      return { success: false, error: message };
    }
  },

  registerOutput: async (payload) => {
    try {
      set({ submitting: true, error: null });
      await createOutput(payload);
      set({ submitting: false });
      await get().fetchStock();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo registrar la salida";
      set({ error: message, submitting: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));
