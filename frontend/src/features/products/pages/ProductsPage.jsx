import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";
import { PageHeader } from "../../../shared/components/PageHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { LoadingBlock } from "../../../shared/components/LoadingBlock";
import { showError, showSuccess } from "../../../shared/utils/toast";

export const ProductsPage = () => {
  const products = useProductStore((s) => s.products);
  const categories = useProductStore((s) => s.categories);
  const loading = useProductStore((s) => s.loading);
  const saving = useProductStore((s) => s.saving);
  const error = useProductStore((s) => s.error);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const searchProducts = useProductStore((s) => s.searchProducts);
  const fetchCategories = useProductStore((s) => s.fetchCategories);
  const createProduct = useProductStore((s) => s.createProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const toggleProductStatus = useProductStore((s) => s.toggleProductStatus);
  const addCategory = useProductStore((s) => s.addCategory);
  const clearError = useProductStore((s) => s.clearError);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const handleSubmit = async (payload) => {
    clearError();
    const res = editing
      ? await updateProduct(editing._id, payload)
      : await createProduct(payload);

    if (res.success) {
      showSuccess(editing ? "Producto actualizado" : "Producto creado en el panal");
      setShowForm(false);
      setEditing(null);
    }
  };

  const handleToggle = async (product) => {
    clearError();
    const res = await toggleProductStatus(product);
    if (res.success) {
      showSuccess(product.isActive ? "Producto desactivado" : "Producto activado");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    clearError();
    await searchProducts({
      name: nameFilter.trim() || undefined,
      category: categoryFilter || undefined,
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    clearError();
    const res = await addCategory(newCategory.trim());
    if (res.success) {
      showSuccess("Categoría agregada");
      setNewCategory("");
    }
  };

  return (
    <div>
      <PageHeader
        title="Productos del panal"
        subtitle="Administración completa de productos"
        actions={
          <button
            type="button"
            className="panel-btn"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            Nuevo producto
          </button>
        }
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto]">
        <form onSubmit={handleSearch} className="panel-card grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="panel-label">Buscar por nombre</label>
            <input
              className="panel-input"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Ej. miel"
            />
          </div>
          <div>
            <label className="panel-label">Categoría</label>
            <select
              className="panel-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="panel-btn">
              Filtrar
            </button>
            <button
              type="button"
              className="panel-btn-ghost"
              onClick={() => {
                setNameFilter("");
                setCategoryFilter("");
                fetchProducts();
              }}
            >
              Limpiar
            </button>
          </div>
        </form>

        <form onSubmit={handleAddCategory} className="panel-card">
          <label className="panel-label">Nueva categoría</label>
          <div className="flex gap-2">
            <input
              className="panel-input"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="HOGAR"
            />
            <button type="submit" className="panel-btn shrink-0" disabled={saving}>
              Añadir
            </button>
          </div>
        </form>
      </div>

      {showForm && (
        <div className="mb-5">
          <ProductForm
            initial={editing}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <LoadingBlock />
      ) : products.length === 0 ? (
        <EmptyState
          title="El panal está vacío"
          description="Registra el primer producto para empezar a gestionar inventario."
          action={
            <button
              type="button"
              className="panel-btn"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              Registrar producto
            </button>
          }
        />
      ) : (
        <ProductTable
          products={products}
          saving={saving}
          onEdit={(product) => {
            setEditing(product);
            setShowForm(true);
          }}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
};
