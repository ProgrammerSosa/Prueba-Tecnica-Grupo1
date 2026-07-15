import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";

export const CategorySelect = ({
  value,
  onChange,
  id = "category",
  required = true,
  placeholder = "Selecciona categoría",
}) => {
  const categories = useProductStore((state) => state.categories);
  const fetchCategories = useProductStore((state) => state.fetchCategories);

  useEffect(() => {
    if (!categories.length) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  return (
    <select
      id={id}
      className="panel-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">{placeholder}</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};
