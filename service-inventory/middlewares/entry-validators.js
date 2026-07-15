import { body } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';

export const validateCreateEntry = [
    validateJWT,
    body('productId')
        .notEmpty()
        .withMessage('El ID del producto es obligatorio')
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    body('quantity')
        .notEmpty()
        .withMessage('La cantidad es obligatoria')
        .isFloat({ gt: 0 })
        .withMessage('La cantidad debe ser un número mayor a 0')
        .toFloat(),
    body('note')
        .optional()
        .isString()
        .withMessage('La nota debe ser un texto')
        .isLength({ max: 500 })
        .withMessage('La nota no puede tener más de 500 caracteres'),
    checkValidators,
];
