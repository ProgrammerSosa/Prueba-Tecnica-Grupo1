import { fetchProducts, getDefaultThreshold } from '../../helpers/inventory-service.js';

export const getLowStockAlert = async (req, res, next) => {
    try {
        const threshold =
            req.query.threshold !== undefined
                ? req.query.threshold
                : getDefaultThreshold();

        const products = await fetchProducts(req.token);

        const lowStock = products
            .filter((product) => Number(product.stock) <= threshold)
            .sort((a, b) => Number(a.stock) - Number(b.stock))
            .map((product) => ({
                _id: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                missingUnits: threshold - Number(product.stock),
                status: Number(product.stock) === 0 ? 'SIN_STOCK' : 'STOCK_BAJO',
            }));

        res.status(200).json({
            success: true,
            message: 'Alerta de stock bajo generada correctamente',
            data: {
                threshold,
                total: lowStock.length,
                products: lowStock,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getOutOfStockAlert = async (req, res, next) => {
    try {
        const products = await fetchProducts(req.token);

        const outOfStock = products
            .filter((product) => Number(product.stock) === 0)
            .map((product) => ({
                _id: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
            }));

        res.status(200).json({
            success: true,
            message: 'Alerta de productos agotados generada correctamente',
            data: {
                total: outOfStock.length,
                products: outOfStock,
            },
        });
    } catch (error) {
        next(error);
    }
};
