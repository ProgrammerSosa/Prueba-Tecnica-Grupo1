import { create } from "zustand";
import {
  getSummaryReport,
  getTopProductsReport,
  getCategoriesReport,
  getLowStockAlert,
  getOutOfStockAlert,
} from "../../../shared/api/reports";

export const useReportsStore = create((set) => ({
  summary: null,
  topProducts: [],
  categories: [],
  lowStock: [],
  outOfStock: [],
  threshold: 5,
  categoryFilter: "",
  loading: false,
  error: null,

  fetchSummary: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await getSummaryReport();
      const payload = data.data || {};
      set({
        summary: payload,
        topProducts: payload.topProducts || [],
        categories: payload.categories || [],
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo cargar el resumen";
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

  fetchAlerts: async (threshold = 5, category = "") => {
    try {
      set({ loading: true, error: null });
      const [lowRes, outRes] = await Promise.all([
        getLowStockAlert(threshold, category),
        getOutOfStockAlert(category),
      ]);

      set({
        lowStock: lowRes.data?.data?.products || [],
        outOfStock: outRes.data?.data?.products || [],
        threshold: lowRes.data?.data?.threshold ?? threshold,
        categoryFilter: category,
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
