import { useEffect } from "react";
import { useReportsStore } from "../store/useReportsStore";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatCard } from "../../../shared/components/StatCard";
import { LoadingBlock } from "../../../shared/components/LoadingBlock";
import { EmptyState } from "../../../shared/components/EmptyState";
import { formatCurrency, formatNumber } from "../../../shared/utils/inventory";
import { showError } from "../../../shared/utils/toast";

export const ReportsPage = () => {
  const summary = useReportsStore((s) => s.summary);
  const topProducts = useReportsStore((s) => s.topProducts);
  const categories = useReportsStore((s) => s.categories);
  const loading = useReportsStore((s) => s.loading);
  const error = useReportsStore((s) => s.error);
  const fetchReports = useReportsStore((s) => s.fetchReports);

  useEffect(() => {
    fetchReports(10);
  }, [fetchReports]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const totals = summary?.totals;

  return (
    <div>
      <PageHeader
        title="Reportes de la colmena"
        subtitle="Resumen general, top productos y categorías"
        actions={
          <button type="button" className="panel-btn" onClick={() => fetchReports(10)}>
            Actualizar reportes
          </button>
        }
      />

      {loading && !summary ? (
        <LoadingBlock />
      ) : !summary && topProducts.length === 0 ? (
        <EmptyState
          title="Sin reportes disponibles"
          description="Verifica service-reports y vuelve a intentar."
          action={
            <button type="button" className="panel-btn" onClick={() => fetchReports(10)}>
              Reintenta el vuelo
            </button>
          }
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total productos"
              value={formatNumber(totals?.totalProducts)}
            />
            <StatCard
              label="Unidades en stock"
              value={formatNumber(totals?.totalStockUnits)}
            />
            <StatCard
              label="Valor total"
              value={formatCurrency(totals?.totalInventoryValue)}
              tone="info"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="panel-card">
              <h2 className="mb-3 font-display text-xl font-bold">
                Top productos
              </h2>
              {topProducts.length === 0 ? (
                <p className="text-sm text-honeycomb">Sin movimiento de salidas aún.</p>
              ) : (
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Vendidos</th>
                        <th>Ventas</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((item) => (
                        <tr key={String(item._id)}>
                          <td className="font-semibold">{item.name}</td>
                          <td>{formatNumber(item.totalSold)}</td>
                          <td>{formatNumber(item.salesCount)}</td>
                          <td>{formatNumber(item.currentStock)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="panel-card">
              <h2 className="mb-3 font-display text-xl font-bold">
                Por categoría
              </h2>
              {categories.length === 0 ? (
                <p className="text-sm text-honeycomb">Sin categorías para resumir.</p>
              ) : (
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Categoría</th>
                        <th>Productos</th>
                        <th>Stock</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((item) => (
                        <tr key={item.category}>
                          <td className="font-semibold">{item.category}</td>
                          <td>{formatNumber(item.productCount)}</td>
                          <td>{formatNumber(item.totalStock)}</td>
                          <td>{formatCurrency(item.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};
