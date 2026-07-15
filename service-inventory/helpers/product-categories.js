'use strict';

const categories = [
    'ELECTRODOMESTICOS',
    'ELECTRONICA',
    'ROPA',
    'ALIMENTOS',
    'HOGAR',
    'DEPORTES',
    'JUGUETES',
];

export const normalizeCategory = (category) => {
    if (typeof category !== 'string') return '';
    return category.trim().toUpperCase();
};


export const getCategories = () => [...categories];

export const isValidCategory = (category) => {
    const normalized = normalizeCategory(category);
    return categories.includes(normalized);
};

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
