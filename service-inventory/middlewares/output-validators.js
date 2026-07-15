import { body } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';

const validatePositiveQuantity = body('quantity')
    .notEmpty()
    .withMessage('La cantidad es obligatoria')
    .isNumeric()
    .withMessage('La cantidad debe ser un número')
    .custom((value) => {
        const quantity = Number(value);

        if (Number.isNaN(quantity)) {
            throw new Error('La cantidad debe ser un número válido');
        }

        if (quantity < 0) {
            throw new Error('La cantidad no puede ser un número negativo');
        }

        if (quantity === 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        return true;
    })
    .toFloat();

export const validateCreateOutput = [
    validateJWT,
    body('productId')
        .notEmpty()
        .withMessage('El ID del producto es obligatorio')
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    validatePositiveQuantity,
    body('note')
        .optional()
        .isString()
        .withMessage('La nota debe ser un texto')
        .isLength({ max: 500 })
        .withMessage('La nota no puede tener más de 500 caracteres'),
    checkValidators,
];
