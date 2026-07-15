import { useEffect, useState } from "react";
import { useReportsStore } from "../store/useReportsStore";
import { PageHeader } from "../../../shared/components/PageHeader";
import { LoadingBlock } from "../../../shared/components/LoadingBlock";
import { EmptyState } from "../../../shared/components/EmptyState";
import { CategorySelect } from "../../products/components/CategorySelect";
import { useDebouncedValue } from "../../../shared/utils/useDebouncedValue";
import { formatCurrency, formatNumber } from "../../../shared/utils/inventory";
import { showError } from "../../../shared/utils/toast";

export const AlertsPage = () => {
  const lowStock = useReportsStore((s) => s.lowStock);
  const outOfStock = useReportsStore((s) => s.outOfStock);
  const threshold = useReportsStore((s) => s.threshold);
  const loading = useReportsStore((s) => s.loading);
  const error = useReportsStore((s) => s.error);
  const fetchAlerts = useReportsStore((s) => s.fetchAlerts);

  const [localThreshold, setLocalThreshold] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const debouncedThreshold = useDebouncedValue(localThreshold, 400);
  const debouncedCategory = useDebouncedValue(categoryFilter, 400);

  useEffect(() => {
    fetchAlerts(debouncedThreshold, debouncedCategory).finally(() =>
      setHasLoadedOnce(true)
    );
  }, [debouncedThreshold, debouncedCategory, fetchAlerts]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const isRefreshing = loading && hasLoadedOnce;
  const showFullLoading = loading && !hasLoadedOnce;

  return (
    <div>
      <PageHeader
        title="Alertas del enjambre"
        subtitle="Stock bajo y productos agotados"
        actions={
          <button
            type="button"
            className="panel-btn"
            onClick={() => fetchAlerts(localThreshold, categoryFilter)}
          >
            Actualizar
          </button>
        }
      />

      <div className="panel-card mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="panel-label" htmlFor="threshold">
            Umbral de stock bajo
          </label>
          <input
            id="threshold"
            type="number"
            min="0"
            className="panel-input w-32"
            value={localThreshold}
            onChange={(e) => setLocalThreshold(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="panel-label" htmlFor="category-filter">
            Categoría
          </label>
          <CategorySelect
            id="category-filter"
            value={categoryFilter}
            onChange={setCategoryFilter}
            required={false}
            placeholder="Todas las categorías"
          />
        </div>
        <p className="pb-2 text-sm text-honeycomb">
          Umbral activo: {threshold}
          {isRefreshing && (
            <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-honeycomb">
              Actualizando...
            </span>
          )}
        </p>
      </div>

      {showFullLoading ? (
        <LoadingBlock label="Revisando el panal..." />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="panel-card panel-card-hover">
            <h2 className="mb-3 font-display text-xl font-bold text-cacao-ink">
              Stock bajo ({lowStock.length})
            </h2>
            {lowStock.length === 0 ? (
              <EmptyState
                title="Sin alertas de stock bajo"
                description="Todos los productos están por encima del umbral."
              />
            ) : (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Faltan</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item) => (
                      <tr key={item._id}>
                        <td data-label="Producto" className="font-semibold">
                          {item.name}
                        </td>
                        <td data-label="Categoría">{item.category}</td>
                        <td data-label="Stock">{formatNumber(item.stock)}</td>
                        <td data-label="Faltan">{formatNumber(item.missingUnits)}</td>
                        <td data-label="Estado">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                              item.status === "SIN_STOCK"
                                ? "bg-danger/20 text-danger"
                                : "bg-honey-nectar/30 text-cacao-ink"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel-card panel-card-hover">
            <h2 className="mb-3 font-display text-xl font-bold text-cacao-ink">
              Agotados ({outOfStock.length})
            </h2>
            {outOfStock.length === 0 ? (
              <EmptyState
                title="Nada agotado"
                description="El panal aún tiene existencias en todos los productos."
              />
            ) : (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStock.map((item) => (
                      <tr key={item._id}>
                        <td data-label="Producto" className="font-semibold">
                          {item.name}
                        </td>
                        <td data-label="Categoría">{item.category}</td>
                        <td data-label="Precio">{formatCurrency(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
