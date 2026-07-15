import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useInventoryStore } from "../store/useInventoryStore";
import { PageHeader } from "../../../shared/components/PageHeader";
import { LoadingBlock } from "../../../shared/components/LoadingBlock";
import { getProductStock } from "../../../shared/utils/inventory";
import { showError, showSuccess } from "../../../shared/utils/toast";

export const EntryPage = () => {
  const products = useInventoryStore((s) => s.products);
  const loading = useInventoryStore((s) => s.loading);
  const submitting = useInventoryStore((s) => s.submitting);
  const fetchStock = useInventoryStore((s) => s.fetchStock);
  const registerEntry = useInventoryStore((s) => s.registerEntry);
  const clearError = useInventoryStore((s) => s.clearError);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { productId: "", quantity: 1, note: "" },
  });

  const productId = watch("productId");
  const selected = useMemo(
    () => products.find((p) => p._id === productId),
    [products, productId]
  );

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const activeProducts = products.filter((p) => p.isActive !== false);

  const onSubmit = async (data) => {
    clearError();
    const res = await registerEntry({
      productId: data.productId,
      quantity: Number(data.quantity),
      note: data.note?.trim() || undefined,
    });
    if (res.success) {
      showSuccess("Entrada de néctar registrada");
      reset({ productId: "", quantity: 1, note: "" });
    } else {
      showError(res.error || "Reintenta el vuelo");
    }
  };

  return (
    <div>
      <PageHeader
        title="Entrada de néctar"
        subtitle="Registro de entradas de inventario"
      />

      {loading && !products.length ? (
        <LoadingBlock />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="panel-card max-w-xl space-y-4">
          <div>
            <label className="panel-label" htmlFor="entry-product">
              Producto
            </label>
            <select
              id="entry-product"
              className="panel-input"
              {...register("productId", { required: true })}
            >
              <option value="">Selecciona un producto activo</option>
              {activeProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({getProductStock(product)} uds)
                </option>
              ))}
            </select>
            {selected && (
              <p className="mt-1 text-xs text-honeycomb">
                Stock actual: {getProductStock(selected)}
              </p>
            )}
          </div>

          <div>
            <label className="panel-label" htmlFor="entry-qty">
              Cantidad
            </label>
            <input
              id="entry-qty"
              type="number"
              min="1"
              className="panel-input"
              {...register("quantity", { required: true, min: 1 })}
            />
          </div>

          <div>
            <label className="panel-label" htmlFor="entry-note">
              Nota (opcional)
            </label>
            <textarea
              id="entry-note"
              rows={3}
              className="panel-input"
              {...register("note")}
              placeholder="Proveedor, lote, observación..."
            />
          </div>

          <button type="submit" className="panel-btn" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrar entrada"}
          </button>
        </form>
      )}
    </div>
  );
};
