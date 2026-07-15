import { query } from 'express-validator';
import { checkValidators } from './checkValidators.js';

export const topProductsValidator = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('El limit debe ser un número entero entre 1 y 50')
        .toInt(),
    checkValidators,
];
