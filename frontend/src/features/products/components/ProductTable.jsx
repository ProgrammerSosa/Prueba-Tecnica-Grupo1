import { getProductStock, formatCurrency, formatNumber } from "../../../shared/utils/inventory";

export const ProductTable = ({ products, onEdit, onToggle, saving }) => {
  if (!products.length) return null;

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Existencias</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="font-semibold">{product.name}</td>
              <td>{product.category}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{formatNumber(getProductStock(product))}</td>
              <td>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                    product.isActive
                      ? "bg-honey-nectar/30 text-cacao-ink"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {product.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="panel-btn-ghost"
                    onClick={() => onEdit(product)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={product.isActive ? "panel-btn-danger" : "panel-btn"}
                    disabled={saving}
                    onClick={() => onToggle(product)}
                  >
                    {product.isActive ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
