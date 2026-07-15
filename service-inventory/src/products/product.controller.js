'use strict';

import Product from './product.model.js';
import {
    addCategoryToEnum,
    getCategories,
    isValidCategory,
    normalizeCategory,
} from '../../helpers/product-categories.js';
import { buildPaginatedMeta, parsePagination } from '../../helpers/pagination.js';

const buildProductFilter = (query = {}) => {
    const filter = {};

    if (query.isActive !== undefined && query.isActive !== '') {
        filter.isActive = query.isActive === 'true' || query.isActive === true;
    }

    if (query.category) {
        filter.category = normalizeCategory(query.category);
    }

    if (query.name) {
        filter.name = { $regex: String(query.name).trim(), $options: 'i' };
    }

    if (query.minStock !== undefined || query.maxStock !== undefined) {
        filter.existences = {};
        if (query.minStock !== undefined && query.minStock !== '') {
            filter.existences.$gte = Number(query.minStock);
        }
        if (query.maxStock !== undefined && query.maxStock !== '') {
            filter.existences.$lte = Number(query.maxStock);
        }
    }

    return filter;
};

export const createProduct = async (req, res) => {
    try {
        const { name, category, price, existences } = req.body;
        const normalizedCategory = normalizeCategory(category);

        if (!isValidCategory(normalizedCategory)) {
            return res.status(400).json({
                success: false,
                message: `Categoría no válida. Categorías permitidas: ${getCategories().join(', ')}`,
                error: 'INVALID_CATEGORY',
                categories: getCategories(),
            });
        }

        const existingProduct = await Product.findOne({ name: name.trim() });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un producto con ese nombre',
                error: 'DUPLICATE_NAME',
            });
        }

        const product = new Product({
            name: name.trim(),
            category: normalizedCategory,
            price: price ?? 0,
            existences: existences ?? 0,
        });

        await product.save();

        return res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            product,
        });
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message,
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const filter = buildProductFilter(req.query);
        const { page, limit, skip, paginated } = parsePagination(req.query);

        const [products, total] = await Promise.all([
            paginated
                ? Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
                : Product.find(filter).sort({ createdAt: -1 }),
            Product.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            total,
            ...(paginated && { pagination: buildPaginatedMeta({ page, limit, total }) }),
            filters: {
                isActive: req.query.isActive ?? null,
                category: req.query.category ? normalizeCategory(req.query.category) : null,
                name: req.query.name || null,
            },
            products,
        });
    } catch (error) {
        console.error('Error al listar productos:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message,
        });
    }
};

export const getProductsByNameOrCategory = async (req, res) => {
    try {
        const { name, category, isActive } = req.query;

        if (!name && !category) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un parámetro de búsqueda: name o category',
                error: 'MISSING_SEARCH_PARAMS',
            });
        }

        const filter = buildProductFilter({ name, category, isActive });
        const products = await Product.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: products.length,
            filters: {
                name: name || null,
                category: category ? normalizeCategory(category) : null,
                isActive: isActive ?? null,
            },
            products,
        });
    } catch (error) {
        console.error('Error al buscar productos:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al buscar productos por nombre o categoría',
            error: error.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                error: 'PRODUCT_NOT_FOUND',
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error('Error al obtener producto:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            error: error.message,
        });
    }
};

export const getLowStockProducts = async (req, res) => {
    try {
        const threshold = Number(req.query.threshold);
        const stockThreshold =
            Number.isFinite(threshold) && threshold >= 0 ? threshold : 5;

        const products = await Product.find({
            isActive: true,
            existences: { $lte: stockThreshold },
        }).sort({ existences: 1, name: 1 });

        return res.status(200).json({
            success: true,
            threshold: stockThreshold,
            total: products.length,
            products,
        });
    } catch (error) {
        console.error('Error al obtener stock bajo:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener productos con stock bajo',
            error: error.message,
        });
    }
};

export const getInventorySummary = async (req, res) => {
    try {
        const [summary] = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    activeProducts: {
                        $sum: { $cond: ['$isActive', 1, 0] },
                    },
                    inactiveProducts: {
                        $sum: { $cond: ['$isActive', 0, 1] },
                    },
                    totalStock: { $sum: '$existences' },
                    totalValue: {
                        $sum: { $multiply: ['$price', '$existences'] },
                    },
                    outOfStock: {
                        $sum: {
                            $cond: [
                                { $and: ['$isActive', { $eq: ['$existences', 0] }] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        const lowStockThreshold = Number(req.query.threshold);
        const threshold =
            Number.isFinite(lowStockThreshold) && lowStockThreshold >= 0
                ? lowStockThreshold
                : 5;

        const lowStockCount = await Product.countDocuments({
            isActive: true,
            existences: { $lte: threshold, $gt: 0 },
        });

        return res.status(200).json({
            success: true,
            summary: {
                totalProducts: summary?.totalProducts ?? 0,
                activeProducts: summary?.activeProducts ?? 0,
                inactiveProducts: summary?.inactiveProducts ?? 0,
                totalStock: summary?.totalStock ?? 0,
                totalValue: Math.round((summary?.totalValue ?? 0) * 100) / 100,
                outOfStock: summary?.outOfStock ?? 0,
                lowStock: lowStockCount,
                lowStockThreshold: threshold,
            },
        });
    } catch (error) {
        console.error('Error al obtener resumen de inventario:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el resumen de inventario',
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, existences } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                error: 'PRODUCT_NOT_FOUND',
            });
        }

        // Las existencias solo se modifican con entradas/salidas (auditoría)
        if (
            existences !== undefined &&
            Number(existences) !== Number(product.existences)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Las existencias solo se modifican mediante entradas o salidas de inventario',
                error: 'STOCK_VIA_MOVEMENTS_ONLY',
                currentStock: product.existences,
            });
        }

        if (name && name.trim() !== product.name) {
            const existingProduct = await Product.findOne({
                name: name.trim(),
                _id: { $ne: id },
            });

            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un producto con ese nombre',
                    error: 'DUPLICATE_NAME',
                });
            }

            product.name = name.trim();
        }

        if (category !== undefined) {
            const normalizedCategory = normalizeCategory(category);

            if (!isValidCategory(normalizedCategory)) {
                return res.status(400).json({
                    success: false,
                    message: `Categoría no válida. Solo se puede cambiar por una categoría existente: ${getCategories().join(', ')}`,
                    error: 'INVALID_CATEGORY',
                    categories: getCategories(),
                });
            }

            product.category = normalizedCategory;
        }

        if (price !== undefined) product.price = price;

        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            product,
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            error: error.message,
        });
    }
};

export const activateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                error: 'PRODUCT_NOT_FOUND',
            });
        }

        if (product.isActive) {
            return res.status(400).json({
                success: false,
                message: 'El producto ya está activo',
                error: 'ALREADY_ACTIVE',
            });
        }

        product.isActive = true;
        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Producto activado correctamente',
            product,
        });
    } catch (error) {
        console.error('Error al activar producto:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al activar el producto',
            error: error.message,
        });
    }
};

export const deactivateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                error: 'PRODUCT_NOT_FOUND',
            });
        }

        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: 'El producto ya está desactivado',
                error: 'ALREADY_INACTIVE',
            });
        }

        product.isActive = false;
        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Producto desactivado correctamente',
            product,
        });
    } catch (error) {
        console.error('Error al desactivar producto:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al desactivar el producto',
            error: error.message,
        });
    }
};

export const getCategoriesList = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            total: getCategories().length,
            categories: getCategories(),
        });
    } catch (error) {
        console.error('Error al listar categorías:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías',
            error: error.message,
        });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const result = await addCategoryToEnum(category);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                error: 'CATEGORY_NOT_ADDED',
                categories: result.categories,
            });
        }

        return res.status(201).json({
            success: true,
            message: result.message,
            category: result.category,
            categories: result.categories,
        });
    } catch (error) {
        console.error('Error al agregar categoría:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al agregar la categoría',
            error: error.message,
        });
    }
};
