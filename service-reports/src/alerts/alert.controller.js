import { fetchProducts, getDefaultThreshold } from '../../helpers/inventory-service.js';

/**
 * GET /alerts/low-stock?threshold=5
 * Productos cuya existencia es menor o igual al umbral (por defecto 5,
 * configurable con LOW_STOCK_THRESHOLD o el query param ?threshold=).
 */
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

/**
 * GET /alerts/out-of-stock
 * Productos completamente agotados (existencia igual a 0).
 */
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
