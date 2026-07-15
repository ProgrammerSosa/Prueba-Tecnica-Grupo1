'use strict';

import Category from '../src/categories/category.model.js';

const DEFAULT_CATEGORIES = [
    'ELECTRODOMESTICOS',
    'ELECTRONICA',
    'ROPA',
    'ALIMENTOS',
    'HOGAR',
    'DEPORTES',
    'JUGUETES',
];

/** Caché en memoria sincronizada con la colección Category */
let categories = [...DEFAULT_CATEGORIES];

export const normalizeCategory = (category) => {
    if (typeof category !== 'string') return '';
    return category.trim().toUpperCase();
};

export const getCategories = () => [...categories];

export const isValidCategory = (category) => {
    const normalized = normalizeCategory(category);
    return categories.includes(normalized);
};

/**
 * Carga categorías desde MongoDB y siembra las por defecto si la colección está vacía.
 */
export const initCategories = async () => {
    try {
        const count = await Category.countDocuments();

        if (count === 0) {
            await Category.insertMany(
                DEFAULT_CATEGORIES.map((name) => ({ name, isActive: true })),
                { ordered: false }
            );
            console.log(`Categorías por defecto sembradas: ${DEFAULT_CATEGORIES.length}`);
        }

        const docs = await Category.find({ isActive: true })
            .sort({ name: 1 })
            .select('name')
            .lean();

        categories = docs.map((doc) => doc.name);

        if (categories.length === 0) {
            categories = [...DEFAULT_CATEGORIES];
        }

        console.log(`Categorías cargadas: ${categories.length}`);
    } catch (error) {
        console.error('Error al inicializar categorías:', error.message);
        categories = [...DEFAULT_CATEGORIES];
    }
};

/**
 * Agrega una nueva categoría (memoria + DB).
 * @returns {{ success: boolean, category?: string, message: string, categories: string[] }}
 */
export const addCategoryToEnum = async (category) => {
    const normalized = normalizeCategory(category);

    if (!normalized) {
        return {
            success: false,
            message: 'La categoría es requerida',
            categories: getCategories(),
        };
    }

    if (normalized.length < 2 || normalized.length > 50) {
        return {
            success: false,
            message: 'La categoría debe tener entre 2 y 50 caracteres',
            categories: getCategories(),
        };
    }

    if (categories.includes(normalized)) {
        return {
            success: false,
            message: 'La categoría ya existe',
            categories: getCategories(),
        };
    }

    try {
        await Category.create({ name: normalized, isActive: true });
        categories.push(normalized);
        categories.sort();

        return {
            success: true,
            category: normalized,
            message: 'Categoría agregada correctamente',
            categories: getCategories(),
        };
    } catch (error) {
        if (error.code === 11000) {
            if (!categories.includes(normalized)) {
                categories.push(normalized);
                categories.sort();
            }
            return {
                success: false,
                message: 'La categoría ya existe',
                categories: getCategories(),
            };
        }

        return {
            success: false,
            message: 'Error al guardar la categoría',
            categories: getCategories(),
        };
    }
};
