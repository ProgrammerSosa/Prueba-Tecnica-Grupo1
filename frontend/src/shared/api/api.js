import axios from "axios";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInventory = axios.create({
  baseURL: import.meta.env.VITE_INVENTORY_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosReports = axios.create({
  baseURL: import.meta.env.VITE_REPORTS_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_INVENTORY_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_AUTH_PATHS = [
  "/auth/register",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-email",
  "/auth/reset-password",
  "/auth/resend-verification",
];

const isPublicAuthRequest = (config) => {
  const url = config?.url || "";
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
};

const isAuthServiceRequest = (config) => {
  const baseURL = config?.baseURL || "";
  const authBase = import.meta.env.VITE_AUTH_URL || "";
  return Boolean(authBase) && baseURL.startsWith(authBase);
};

const attachAuthToken = (config) => {
  if (isPublicAuthRequest(config)) {
    return config;
  }

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // #region agent log
  if ((config?.baseURL || "").includes("3008") || (config?.url || "").includes("/reports") || (config?.url || "").includes("/alerts")) {
    let jwtClaims = null;
    try {
      const payload = JSON.parse(atob(String(token || "").split(".")[1] || ""));
      jwtClaims = { iss: payload.iss, aud: payload.aud, exp: payload.exp, hasSub: Boolean(payload.sub) };
    } catch {
      jwtClaims = { parseError: true };
    }
    fetch('http://127.0.0.1:7579/ingest/fe688a18-e41e-438d-adc4-2b2c5e8f12dc',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6d89a4'},body:JSON.stringify({sessionId:'6d89a4',runId:'pre-fix',hypothesisId:'A_B_C',location:'api.js:attachAuthToken',message:'reports request auth header',data:{hasToken:Boolean(token),tokenLen:token?String(token).length:0,hasAuthHeader:Boolean(config.headers?.Authorization),baseURL:config.baseURL||null,url:config.url||null,jwtClaims,reportsEnv:import.meta.env.VITE_REPORTS_URL||null},timestamp:Date.now()})}).catch(()=>{});
  }
  // #endregion

  return config;
};

const shouldEndSessionOn401 = (error) => {
  const { status, data } = error.response || {};
  if (status !== 401) return false;

  const token = useAuthStore.getState().token;
  if (!token) return false;

  const config = error.config;
  if (isPublicAuthRequest(config)) return false;

  const errorCode = data?.error;
  const message = String(data?.message || "").toLowerCase();
  const url = config?.url || "";

  const tokenExpired =
    errorCode === "TOKEN_EXPIRED" ||
    message.includes("expirado") ||
    message.includes("expired");

  if (tokenExpired) return true;

  // Solo auth confirma que la sesión local es inválida; 401 de reports/inventory
  // (secret distinto, servicio caído) no debe expulsar al usuario.
  const isProfileCheck = url.includes("/auth/profile");
  if (isAuthServiceRequest(config) && isProfileCheck) {
    return (
      errorCode === "INVALID_TOKEN" ||
      errorCode === "MISSING_TOKEN" ||
      message.includes("token")
    );
  }

  return false;
};

const handleUnauthorized = (error) => {
  // #region agent log
  const cfg = error.config || {};
  const isReports =
    (cfg.baseURL || "").includes("3008") ||
    (cfg.url || "").includes("/reports") ||
    (cfg.url || "").includes("/alerts");
  if (isReports || error.response?.status === 401) {
    fetch('http://127.0.0.1:7579/ingest/fe688a18-e41e-438d-adc4-2b2c5e8f12dc',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6d89a4'},body:JSON.stringify({sessionId:'6d89a4',runId:'pre-fix',hypothesisId:'B_D_E',location:'api.js:handleUnauthorized',message:'401 or reports error response',data:{status:error.response?.status||null,errorCode:error.response?.data?.error||null,errorMessage:error.response?.data?.message||null,url:cfg.url||null,baseURL:cfg.baseURL||null,hadAuthHeader:Boolean(cfg.headers?.Authorization),willEndSession:shouldEndSessionOn401(error)},timestamp:Date.now()})}).catch(()=>{});
  }
  // #endregion

  if (shouldEndSessionOn401(error)) {
    useAuthStore.getState().logout();
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }
  return Promise.reject(error);
};

[axiosAuth, axiosInventory, axiosReports, axiosApi].forEach((client) => {
  client.interceptors.request.use(attachAuthToken);
  client.interceptors.response.use((response) => response, handleUnauthorized);
});

export { axiosAuth, axiosInventory, axiosReports, axiosApi };
