import { axiosReports } from "./api";

export const getLowStockAlert = (threshold, category) =>
  axiosReports.get("/alerts/low-stock", {
    params: {
      ...(threshold !== undefined ? { threshold } : {}),
      ...(category ? { category } : {}),
    },
  });

export const getOutOfStockAlert = (category) =>
  axiosReports.get("/alerts/out-of-stock", {
    params: category ? { category } : undefined,
  });

export const getTopProductsReport = (limit = 5) =>
  axiosReports.get("/reports/top-products", { params: { limit } });

export const getCategoriesReport = () =>
  axiosReports.get("/reports/categories");

export const getSummaryReport = () =>
  axiosReports.get("/reports/summary");

export const exportSummaryReport = (format) =>
  axiosReports.get("/reports/summary/export", {
    params: { format },
    responseType: "blob",
  });
