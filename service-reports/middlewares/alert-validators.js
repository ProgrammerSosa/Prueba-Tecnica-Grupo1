import { query } from 'express-validator';
import { checkValidators } from './checkValidators.js';

export const lowStockValidator = [
    query('threshold')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El threshold debe ser un número entero mayor o igual a 0')
        .toInt(),
    query('category')
        .optional()
        .isString()
        .trim()
        .toUpperCase(),
    checkValidators,
];

export const outOfStockValidator = [
    query('category')
        .optional()
        .isString()
        .trim()
        .toUpperCase(),
    checkValidators,
];
