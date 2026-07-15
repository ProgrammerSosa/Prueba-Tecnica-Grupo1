'use strict';

import Product from './product.model.js';
import {
    addCategoryToEnum,
    getCategories,
    isValidCategory,
    normalizeCategory,
} from '../../helpers/product-categories.js';

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
            return res.status(409).json({
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
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: error.message || 'Datos de producto inválidos',
                error: error.name,
            });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un producto con ese nombre',
                error: 'DUPLICATE_NAME',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message,
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: products.length,
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

/**
 * Listar productos por nombre y/o categoría
 * GET /api/v1/products/search?name=...&category=...
 */
export const getProductsByNameOrCategory = async (req, res) => {
    try {
        const { name, category } = req.query;

        if (!name && !category) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un parámetro de búsqueda: name o category',
                error: 'MISSING_SEARCH_PARAMS',
            });
        }

        const filter = {};

        if (name) {
            filter.name = { $regex: name.trim(), $options: 'i' };
        }

        if (category) {
            filter.category = normalizeCategory(category);
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: products.length,
            filters: {
                name: name || null,
                category: category ? normalizeCategory(category) : null,
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
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Formato de ID inválido',
                error: 'INVALID_ID',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
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

        if (name && name.trim() !== product.name) {
            const existingProduct = await Product.findOne({
                name: name.trim(),
                _id: { $ne: id },
            });

            if (existingProduct) {
                return res.status(409).json({
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
        if (existences !== undefined) product.existences = existences;

        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            product,
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: error.message || 'Datos de producto inválidos',
                error: error.name,
            });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un producto con ese nombre',
                error: 'DUPLICATE_NAME',
            });
        }
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
        const result = addCategoryToEnum(category);

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
