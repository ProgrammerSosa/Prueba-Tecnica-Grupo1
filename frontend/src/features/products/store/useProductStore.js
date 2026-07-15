import { create } from "zustand";
import {
  getProducts,
  searchProducts,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  getCategories,
  addCategory,
} from "../../../shared/api/inventory";

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  saving: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await getProducts();
      set({ products: data.products || [], loading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudieron cargar los productos";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  searchProducts: async ({ name, category }) => {
    try {
      set({ loading: true, error: null });
      if (!name && !category) {
        return get().fetchProducts();
      }
      const { data } = await searchProducts({
        ...(name ? { name } : {}),
        ...(category ? { category } : {}),
      });
      set({ products: data.products || [], loading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo buscar productos";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await getCategories();
      set({ categories: data.categories || [] });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudieron cargar las categorías";
      set({ error: message });
      return { success: false, error: message };
    }
  },

  createProduct: async (payload) => {
    try {
      set({ saving: true, error: null });
      await createProduct(payload);
      set({ saving: false });
      await get().fetchProducts();
      await get().fetchCategories();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo crear el producto";
      set({ error: message, saving: false });
      return { success: false, error: message };
    }
  },

  updateProduct: async (id, payload) => {
    try {
      set({ saving: true, error: null });
      await updateProduct(id, payload);
      set({ saving: false });
      await get().fetchProducts();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo actualizar el producto";
      set({ error: message, saving: false });
      return { success: false, error: message };
    }
  },

  toggleProductStatus: async (product) => {
    try {
      set({ saving: true, error: null });
      if (product.isActive) {
        await deactivateProduct(product._id);
      } else {
        await activateProduct(product._id);
      }
      set({ saving: false });
      await get().fetchProducts();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo cambiar el estado";
      set({ error: message, saving: false });
      return { success: false, error: message };
    }
  },

  addCategory: async (category) => {
    try {
      set({ saving: true, error: null });
      const { data } = await addCategory(category);
      set({
        categories: data.categories || get().categories,
        saving: false,
      });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "No se pudo agregar la categoría";
      set({ error: message, saving: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));
