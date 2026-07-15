import Output from '../outputs/output.model.js';
import { fetchProducts, getDefaultThreshold } from '../../helpers/inventory-service.js';

const round2 = (number) => Math.round(number * 100) / 100;

const buildCategorySummary = (products) => {
    const byCategory = new Map();

    for (const product of products) {
        const key = product.category || 'Sin categoría';
        const entry = byCategory.get(key) ?? {
            category: key,
            productCount: 0,
            totalStock: 0,
            totalValue: 0,
        };

        entry.productCount += 1;
        entry.totalStock += Number(product.stock) || 0;
        entry.totalValue += (Number(product.price) || 0) * (Number(product.stock) || 0);

        byCategory.set(key, entry);
    }

    return [...byCategory.values()]
        .map((category) => ({ ...category, totalValue: round2(category.totalValue) }))
        .sort((a, b) => b.totalValue - a.totalValue);
};

const aggregateTopProducts = (limit) =>
    Output.aggregate([
        {
            $group: {
                _id: '$product',
                totalSold: { $sum: '$quantity' },
                salesCount: { $sum: 1 },
            },
        },
        { $sort: { totalSold: -1, salesCount: -1 } },
        { $limit: limit },
    ]);

const enrichTopProducts = (rows, products) => {
    const productsById = new Map(products.map((product) => [String(product._id), product]));

    return rows.map((row) => {
        const product = productsById.get(String(row._id));

        return {
            _id: row._id,
            name: product?.name ?? 'Producto desconocido',
            category: product?.category ?? 'Sin categoría',
            price: product?.price ?? null,
            currentStock: product?.stock ?? null,
            totalSold: row.totalSold,
            salesCount: row.salesCount,
        };
    });
};

export const getTopProducts = async (req, res, next) => {
    try {
        const limit = req.query.limit !== undefined ? req.query.limit : 5;

        const [rows, products] = await Promise.all([
            aggregateTopProducts(limit),
            fetchProducts(req.token),
        ]);

        const topProducts = enrichTopProducts(rows, products);

        res.status(200).json({
            success: true,
            message: 'Reporte de productos más vendidos generado correctamente',
            data: {
                limit,
                total: topProducts.length,
                products: topProducts,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoriesReport = async (req, res, next) => {
    try {
        const products = await fetchProducts(req.token);
        const categories = buildCategorySummary(products);

        res.status(200).json({
            success: true,
            message: 'Reporte por categorías generado correctamente',
            data: {
                totalCategories: categories.length,
                categories,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getSummaryReport = async (req, res, next) => {
    try {
        const threshold = getDefaultThreshold();

        const [rows, products] = await Promise.all([
            aggregateTopProducts(5),
            fetchProducts(req.token),
        ]);

        const totalStockUnits = products.reduce(
            (sum, product) => sum + (Number(product.stock) || 0),
            0
        );
        const totalInventoryValue = products.reduce(
            (sum, product) =>
                sum + (Number(product.price) || 0) * (Number(product.stock) || 0),
            0
        );

        res.status(200).json({
            success: true,
            message: 'Resumen general del inventario generado correctamente',
            data: {
                totals: {
                    totalProducts: products.length,
                    totalStockUnits,
                    totalInventoryValue: round2(totalInventoryValue),
                },
                alerts: {
                    threshold,
                    lowStockCount: products.filter(
                        (product) => Number(product.stock) <= threshold
                    ).length,
                    outOfStockCount: products.filter(
                        (product) => Number(product.stock) === 0
                    ).length,
                },
                categories: buildCategorySummary(products),
                topProducts: enrichTopProducts(rows, products),
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        next(error);
    }
};
