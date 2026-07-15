import { axiosInventory } from "./api";

export const getProducts = () => axiosInventory.get("/products");

export const searchProducts = (params) =>
  axiosInventory.get("/products/search", { params });

export const getProductById = (id) => axiosInventory.get(`/products/${id}`);

export const createProduct = (payload) =>
  axiosInventory.post("/products", payload);

export const updateProduct = (id, payload) =>
  axiosInventory.put(`/products/${id}`, payload);

export const activateProduct = (id) =>
  axiosInventory.put(`/products/${id}/activate`);

export const deactivateProduct = (id) =>
  axiosInventory.put(`/products/${id}/deactivate`);

export const getCategories = () =>
  axiosInventory.get("/products/categories");

export const addCategory = (category) =>
  axiosInventory.post("/products/categories", { category });

export const createEntry = (payload) =>
  axiosInventory.post("/entries", payload);

export const createOutput = (payload) =>
  axiosInventory.post("/outputs", payload);
