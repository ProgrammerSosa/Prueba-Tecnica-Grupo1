import { useEffect, useState } from "react";
import { useInventoryStore } from "../store/useInventoryStore";
import { useProductStore } from "../../products/store/useProductStore";
import { PageHeader } from "../../../shared/components/PageHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { LoadingBlock } from "../../../shared/components/LoadingBlock";
import {
  formatCurrency,
  formatNumber,
  getProductStock,
} from "../../../shared/utils/inventory";
import { showError } from "../../../shared/utils/toast";

export const InventoryPage = () => {
  const products = useInventoryStore((s) => s.products);
  const loading = useInventoryStore((s) => s.loading);
  const error = useInventoryStore((s) => s.error);
  const fetchStock = useInventoryStore((s) => s.fetchStock);
  const searchStock = useInventoryStore((s) => s.searchStock);
  const categories = useProductStore((s) => s.categories);
  const fetchCategories = useProductStore((s) => s.fetchCategories);

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchStock();
    fetchCategories();
  }, [fetchStock, fetchCategories]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchStock({
      name: nameFilter.trim() || undefined,
      category: categoryFilter || undefined,
    });
  };

  return (
    <div>
      <PageHeader
        title="Inventario disponible"
        subtitle="Consulta de existencias del panal"
        actions={
          <button type="button" className="panel-btn" onClick={() => fetchStock()}>
            Refrescar
          </button>
        }
      />

      <form
        onSubmit={handleSearch}
        className="panel-card mb-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <label className="panel-label">Nombre</label>
          <input
            className="panel-input"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Buscar producto"
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
              fetchStock();
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {loading ? (
        <LoadingBlock />
      ) : products.length === 0 ? (
        <EmptyState
          title="Sin existencias visibles"
          description="Aún no hay productos o el filtro no devolvió resultados."
        />
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Existencias</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = getProductStock(product);
                return (
                  <tr key={product._id}>
                    <td data-label="Producto" className="font-semibold">{product.name}</td>
                    <td data-label="Categoría">{product.category}</td>
                    <td data-label="Precio">{formatCurrency(product.price)}</td>
                    <td data-label="Existencias">
                      <span
                        className={
                          stock === 0
                            ? "font-bold text-danger"
                            : stock <= 5
                              ? "font-bold text-honeycomb"
                              : "font-semibold"
                        }
                      >
                        {formatNumber(stock)}
                      </span>
                    </td>
                    <td data-label="Estado">{product.isActive ? "Activo" : "Inactivo"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
