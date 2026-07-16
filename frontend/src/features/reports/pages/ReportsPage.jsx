import { useEffect, useState } from "react";
import { useReportsStore } from "../store/useReportsStore";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatCard } from "../../../shared/components/StatCard";
import { LoadingBlock } from "../../../shared/components/LoadingBlock";
import { EmptyState } from "../../../shared/components/EmptyState";
import { formatCurrency, formatNumber } from "../../../shared/utils/inventory";
import { showError, showSuccess } from "../../../shared/utils/toast";
import { exportSummaryReport } from "../../../shared/api/reports";
import { downloadBlob } from "../../../shared/utils/downloadBlob";

export const ReportsPage = () => {
  const summary = useReportsStore((s) => s.summary);
  const topProducts = useReportsStore((s) => s.topProducts);
  const categories = useReportsStore((s) => s.categories);
  const loading = useReportsStore((s) => s.loading);
  const error = useReportsStore((s) => s.error);
  const fetchReports = useReportsStore((s) => s.fetchReports);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    fetchReports(10);
  }, [fetchReports]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const totals = summary?.totals;

  const handleExport = async (format) => {
    try {
      setExporting(format);
      const { data } = await exportSummaryReport(format);
      downloadBlob(data, `resumen-beehive.${format}`);
      showSuccess("Descarga iniciada.");
    } catch {
      showError("No se pudo exportar el resumen.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Reportes de la colmena"
        subtitle="Resumen general, top productos y categorías"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="panel-btn-ghost"
              disabled={exporting === "xlsx"}
              onClick={() => handleExport("xlsx")}
            >
              {exporting === "xlsx" ? "Exportando..." : "Exportar Excel"}
            </button>
            <button
              type="button"
              className="panel-btn-ghost"
              disabled={exporting === "pdf"}
              onClick={() => handleExport("pdf")}
            >
              {exporting === "pdf" ? "Exportando..." : "Exportar PDF"}
            </button>
            <button type="button" className="panel-btn" onClick={() => fetchReports(10)}>
              Actualizar reportes
            </button>
          </div>
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
            <section className="panel-card panel-card-hover">
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
                          <td data-label="Producto" className="font-semibold">{item.name}</td>
                          <td data-label="Vendidos">{formatNumber(item.totalSold)}</td>
                          <td data-label="Ventas">{formatNumber(item.salesCount)}</td>
                          <td data-label="Stock">{formatNumber(item.currentStock)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="panel-card panel-card-hover">
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
                          <td data-label="Categoría" className="font-semibold">{item.category}</td>
                          <td data-label="Productos">{formatNumber(item.productCount)}</td>
                          <td data-label="Stock">{formatNumber(item.totalStock)}</td>
                          <td data-label="Valor">{formatCurrency(item.totalValue)}</td>
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
