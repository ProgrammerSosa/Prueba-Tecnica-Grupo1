'use strict';

import { body } from 'express-validator';
import { InventoryMessages } from './inventory-messages.js';

/**
 * Valida una cantidad de movimiento de inventario.
 * @returns {{ valid: true, quantity: number } | { valid: false, message: string }}
 */
export const parsePositiveQuantity = (value) => {
    if (value === undefined || value === null || value === '') {
        return { valid: false, message: InventoryMessages.QUANTITY_REQUIRED };
    }

    const quantity = Number(value);

    if (Number.isNaN(quantity)) {
        return { valid: false, message: InventoryMessages.QUANTITY_INVALID };
    }

    if (quantity < 0) {
        return { valid: false, message: InventoryMessages.QUANTITY_NEGATIVE };
    }

    if (quantity === 0) {
        return { valid: false, message: InventoryMessages.QUANTITY_ZERO };
    }

    return { valid: true, quantity };
};

/**
 * Cadena express-validator reutilizable para body.quantity en entries y outputs.
 */
export const quantityBodyValidator = body('quantity')
    .notEmpty()
    .withMessage(InventoryMessages.QUANTITY_REQUIRED)
    .isNumeric()
    .withMessage(InventoryMessages.QUANTITY_NOT_NUMBER)
    .custom((value) => {
        const result = parsePositiveQuantity(value);
        if (!result.valid) {
            throw new Error(result.message);
        }
        return true;
    })
    .toFloat();
