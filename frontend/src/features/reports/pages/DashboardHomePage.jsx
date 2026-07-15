import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useReportsStore } from "../store/useReportsStore";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatCard } from "../../../shared/components/StatCard";
import { LoadingBlock } from "../../../shared/components/LoadingBlock";
import { EmptyState } from "../../../shared/components/EmptyState";
import { formatCurrency, formatNumber } from "../../../shared/utils/inventory";
import { showError } from "../../../shared/utils/toast";

export const DashboardHomePage = () => {
  const summary = useReportsStore((s) => s.summary);
  const topProducts = useReportsStore((s) => s.topProducts);
  const loading = useReportsStore((s) => s.loading);
  const error = useReportsStore((s) => s.error);
  const fetchSummary = useReportsStore((s) => s.fetchSummary);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const totals = summary?.totals;
  const alerts = summary?.alerts;

  return (
    <div>
      <PageHeader
        title="Colmena de control"
        subtitle="Resumen operativo del inventario"
        actions={
          <button type="button" className="panel-btn" onClick={() => fetchSummary()}>
            Actualizar
          </button>
        }
      />

      {loading && !summary ? (
        <LoadingBlock />
      ) : !summary ? (
        <EmptyState
          title="Sin datos de la colmena"
          description="Asegura que service-reports esté en el puerto 3008 y reintenta el vuelo."
          action={
            <button type="button" className="panel-btn" onClick={() => fetchSummary()}>
              Reintenta el vuelo
            </button>
          }
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Productos"
              value={formatNumber(totals?.totalProducts)}
              hint="En el panal"
            />
            <StatCard
              label="Unidades"
              value={formatNumber(totals?.totalStockUnits)}
              hint="Existencias totales"
            />
            <StatCard
              label="Valor inventario"
              value={formatCurrency(totals?.totalInventoryValue)}
              hint="Precio x stock"
              tone="info"
            />
            <StatCard
              label="Alertas"
              value={formatNumber(
                (alerts?.lowStockCount || 0) + (alerts?.outOfStockCount || 0)
              )}
              hint={`Bajo: ${alerts?.lowStockCount || 0} · Agotados: ${alerts?.outOfStockCount || 0}`}
              tone="warn"
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Link to="/dashboard/products" className="panel-btn no-underline">
              Gestionar productos
            </Link>
            <Link to="/dashboard/entries" className="panel-btn-ghost no-underline">
              Registrar entrada
            </Link>
            <Link to="/dashboard/alerts" className="panel-btn-ghost no-underline">
              Ver alertas
            </Link>
            <Link to="/dashboard/reports" className="panel-btn-ghost no-underline">
              Reportes
            </Link>
          </div>

          <div className="panel-card">
            <h2 className="mb-3 font-display text-xl font-bold">Más movidos del enjambre</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-honeycomb">
                Aún no hay salidas registradas para ranking.
              </p>
            ) : (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Vendidos</th>
                      <th>Stock actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((item) => (
                      <tr key={String(item._id)}>
                        <td className="font-semibold">{item.name}</td>
                        <td>{item.category}</td>
                        <td>{formatNumber(item.totalSold)}</td>
                        <td>{formatNumber(item.currentStock)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
