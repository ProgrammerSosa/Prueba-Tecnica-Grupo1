import { create } from "zustand";
import {
  getSummaryReport,
  getTopProductsReport,
  getCategoriesReport,
  getLowStockAlert,
  getOutOfStockAlert,
} from "../../../shared/api/reports";
import { useAuthStore } from "../../auth/store/useAuthStore";

export const useReportsStore = create((set) => ({
  summary: null,
  topProducts: [],
  categories: [],
  lowStock: [],
  outOfStock: [],
  threshold: 5,
  loading: false,
  error: null,

  fetchSummary: async () => {
    try {
      set({ loading: true, error: null });
      // #region agent log
      fetch('http://127.0.0.1:7579/ingest/fe688a18-e41e-438d-adc4-2b2c5e8f12dc',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6d89a4'},body:JSON.stringify({sessionId:'6d89a4',runId:'pre-fix',hypothesisId:'A',location:'useReportsStore.js:fetchSummary',message:'fetchSummary start',data:{hasToken:Boolean(useAuthStore.getState().token)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      const { data } = await getSummaryReport();
      const payload = data.data || {};
      set({
        summary: payload,
        topProducts: payload.topProducts || [],
        categories: payload.categories || [],
        loading: false,
      });
      // #region agent log
      fetch('http://127.0.0.1:7579/ingest/fe688a18-e41e-438d-adc4-2b2c5e8f12dc',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6d89a4'},body:JSON.stringify({sessionId:'6d89a4',runId:'pre-fix',hypothesisId:'A',location:'useReportsStore.js:fetchSummary:success',message:'fetchSummary ok',data:{hasTotals:Boolean(payload.totals)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo cargar el resumen";
      // #region agent log
      fetch('http://127.0.0.1:7579/ingest/fe688a18-e41e-438d-adc4-2b2c5e8f12dc',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6d89a4'},body:JSON.stringify({sessionId:'6d89a4',runId:'pre-fix',hypothesisId:'B_D_E',location:'useReportsStore.js:fetchSummary:catch',message:'fetchSummary failed',data:{status:err.response?.status||null,errorCode:err.response?.data?.error||null,errorMessage:message},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchReports: async (limit = 5) => {
    try {
      set({ loading: true, error: null });
      const [topRes, catRes, summaryRes] = await Promise.all([
        getTopProductsReport(limit),
        getCategoriesReport(),
        getSummaryReport(),
      ]);

      set({
        topProducts: topRes.data?.data?.products || [],
        categories: catRes.data?.data?.categories || [],
        summary: summaryRes.data?.data || null,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudieron cargar los reportes";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchAlerts: async (threshold = 5) => {
    try {
      set({ loading: true, error: null });
      const [lowRes, outRes] = await Promise.all([
        getLowStockAlert(threshold),
        getOutOfStockAlert(),
      ]);

      set({
        lowStock: lowRes.data?.data?.products || [],
        outOfStock: outRes.data?.data?.products || [],
        threshold: lowRes.data?.data?.threshold ?? threshold,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudieron cargar las alertas";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));
