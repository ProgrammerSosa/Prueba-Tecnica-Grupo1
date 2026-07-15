import { axiosReports } from "./api";

export const getLowStockAlert = (threshold) =>
  axiosReports.get("/alerts/low-stock", {
    params: threshold !== undefined ? { threshold } : undefined,
  });

export const getOutOfStockAlert = () =>
  axiosReports.get("/alerts/out-of-stock");

export const getTopProductsReport = (limit = 5) =>
  axiosReports.get("/reports/top-products", { params: { limit } });

export const getCategoriesReport = () =>
  axiosReports.get("/reports/categories");

export const getSummaryReport = () =>
  axiosReports.get("/reports/summary");
