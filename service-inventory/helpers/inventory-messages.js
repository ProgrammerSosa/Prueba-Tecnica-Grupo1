'use strict';

export const InventoryMessages = {
    ENTRY_SUCCESS: 'Entrada registrada exitosamente',
    ENTRY_ERROR: 'Error al registrar la entrada',
    ENTRY_INACTIVE_PRODUCT: 'No se pueden registrar entradas para un producto inactivo',

    OUTPUT_SUCCESS: 'Salida registrada exitosamente',
    OUTPUT_ERROR: 'Error al registrar la salida',
    OUTPUT_INACTIVE_PRODUCT: 'No se pueden registrar salidas para un producto inactivo',
    OUTPUT_INSUFFICIENT_STOCK: 'La cantidad de salida no puede ser mayor a la existencia del producto',

    PRODUCT_NOT_FOUND: 'Producto no encontrado',

    QUANTITY_REQUIRED: 'La cantidad es obligatoria',
    QUANTITY_NOT_NUMBER: 'La cantidad debe ser un número',
    QUANTITY_INVALID: 'La cantidad debe ser un número válido',
    QUANTITY_NEGATIVE: 'La cantidad no puede ser un número negativo',
    QUANTITY_ZERO: 'La cantidad debe ser mayor a 0',
};

export const successResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res, statusCode, message, extra = {}) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...extra,
    });
};
