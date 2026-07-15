'use strict';

import { query } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';

export const validateHistoryQuery = [
    validateJWT,
    query('type')
        .optional()
        .isIn(['ENTRY', 'OUTPUT', 'entry', 'output'])
        .withMessage('type debe ser ENTRY u OUTPUT'),
    query('productId')
        .optional()
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    query('from')
        .optional()
        .isISO8601()
        .withMessage('from debe ser una fecha ISO8601 válida'),
    query('to')
        .optional()
        .isISO8601()
        .withMessage('to debe ser una fecha ISO8601 válida'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page debe ser un entero mayor o igual a 1'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit debe ser un entero entre 1 y 100'),
    checkValidators,
];
