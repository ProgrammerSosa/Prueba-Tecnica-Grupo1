'use strict';

import { body, param, query } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { getCategories, isValidCategory, normalizeCategory } from '../helpers/product-categories.js';

export const validateCreateProduct = [
    //validateJWT,
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre del producto es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('La categoría es requerida')
        .custom((value) => {
            if (!isValidCategory(value)) {
                throw new Error(
                    `Categoría no válida. Categorías permitidas: ${getCategories().join(', ')}`
                );
            }
            return true;
        }),
    body('price')
        .notEmpty()
        .isFloat({ min: 0.1 })
        .withMessage('El precio debe ser un número mayor a 0'),
    body('existences')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Las existencias deben ser un número entero mayor o igual a 0'),
    checkValidators,
];

export const validateUpdateProduct = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido de MongoDB'),
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('category')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('La categoría no puede estar vacía')
        .custom((value) => {
            if (!isValidCategory(value)) {
                throw new Error(
                    `Categoría no válida. Solo se puede cambiar por una existente: ${getCategories().join(', ')}`
                );
            }
            return true;
        }),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número mayor o igual a 0'),
    body('existences')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Las existencias deben ser un número entero mayor o igual a 0'),
    checkValidators,
];

export const validateProductStatusChange = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido de MongoDB'),
    checkValidators,
];

export const validateGetProductById = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido de MongoDB'),
    checkValidators,
];

export const validateSearchProducts = [
    query('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('El nombre de búsqueda debe tener entre 1 y 100 caracteres'),
    query('category')
        .optional()
        .trim()
        .customSanitizer((value) => normalizeCategory(value))
        .isLength({ min: 1, max: 50 })
        .withMessage('La categoría de búsqueda debe tener entre 1 y 50 caracteres'),
    checkValidators,
];

export const validateAddCategory = [
    validateJWT,
    body('category')
        .trim()
        .notEmpty()
        .withMessage('La categoría es requerida')
        .isLength({ min: 2, max: 50 })
        .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
    checkValidators,
];
