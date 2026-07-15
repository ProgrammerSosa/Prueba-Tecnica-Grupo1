export const getProductStock = (product) => {
  if (!product) return 0;
  const value = product.existences ?? product.stock ?? 0;
  return Number(value) || 0;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const formatNumber = (value) =>
  new Intl.NumberFormat("es-GT").format(Number(value) || 0);
