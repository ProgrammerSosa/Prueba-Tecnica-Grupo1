import { useEffect, useState } from "react";
import { CategorySelect } from "./CategorySelect";

const emptyForm = {
  name: "",
  category: "",
  price: 0,
  existences: 0,
};

export const ProductForm = ({ initial, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        category: initial.category || "",
        price: initial.price ?? 0,
        existences: initial.existences ?? initial.stock ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "price" || field === "existences" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price) || 0,
      existences: Number(form.existences) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="panel-card space-y-4">
      <h3 className="font-display text-xl font-bold text-cacao-ink">
        {initial ? "Editar producto" : "Nuevo producto"}
      </h3>

      <div>
        <label className="panel-label" htmlFor="product-name">
          Nombre
        </label>
        <input
          id="product-name"
          className="panel-input"
          value={form.name}
          onChange={handleChange("name")}
          required
          maxLength={80}
        />
      </div>

      <div>
        <label className="panel-label" htmlFor="product-category">
          Categoría
        </label>
        <CategorySelect
          id="product-category"
          value={form.category}
          onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="panel-label" htmlFor="product-price">
            Precio
          </label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            className="panel-input"
            value={form.price}
            onChange={handleChange("price")}
          />
        </div>
        <div>
          <label className="panel-label" htmlFor="product-stock">
            Existencias
          </label>
          <input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            className="panel-input"
            value={form.existences}
            onChange={handleChange("existences")}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" className="panel-btn" disabled={saving}>
          {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear producto"}
        </button>
        {onCancel && (
          <button type="button" className="panel-btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
