'use strict';

import { body, param, query } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { quantityBodyValidator } from '../helpers/quantity-rules.js';

const listFilters = [
    query('productId')
        .optional()
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    query('isActive')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('isActive debe ser true o false'),
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
];

export const validateCreateEntry = [
    validateJWT,
    body('productId')
        .notEmpty()
        .withMessage('El ID del producto es obligatorio')
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    quantityBodyValidator,
    body('note')
        .optional()
        .isString()
        .withMessage('La nota debe ser un texto')
        .isLength({ max: 500 })
        .withMessage('La nota no puede tener más de 500 caracteres'),
    checkValidators,
];

export const validateListEntries = [
    validateJWT,
    ...listFilters,
    checkValidators,
];

export const validateGetEntryById = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido de MongoDB'),
    checkValidators,
];
