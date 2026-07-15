import { body } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { quantityBodyValidator } from '../helpers/quantity-rules.js';

export const validateCreateOutput = [
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
