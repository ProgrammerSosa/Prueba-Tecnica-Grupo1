'use strict';

/**
 * Categorías disponibles para productos.
 * Se pueden agregar nuevas en runtime mediante addCategory().
 */
const categories = [
    'ELECTRODOMESTICOS',
    'ELECTRONICA',
    'ROPA',
    'ALIMENTOS',
    'HOGAR',
    'DEPORTES',
    'JUGUETES',
];

/**
 * Normaliza el nombre de una categoría (trim + mayúsculas).
 */
export const normalizeCategory = (category) => {
    if (typeof category !== 'string') return '';
    return category.trim().toUpperCase();
};

/**
 * Obtiene una copia de las categorías actuales.
 */
export const getCategories = () => [...categories];

/**
 * Verifica si una categoría existe en el enum.
 */
export const isValidCategory = (category) => {
    const normalized = normalizeCategory(category);
    return categories.includes(normalized);
};

/**
 * Agrega una nueva categoría al enum.
 * @returns {{ success: boolean, category?: string, message: string, categories: string[] }}
 */
export const addCategoryToEnum = (category) => {
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

    categories.push(normalized);

    return {
        success: true,
        category: normalized,
        message: 'Categoría agregada correctamente',
        categories: getCategories(),
    };
};
