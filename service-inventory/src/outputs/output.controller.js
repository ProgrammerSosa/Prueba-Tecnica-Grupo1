'use strict';

import Output from './output.model.js';
import Product from '../products/product.model.js';
import { buildPaginatedMeta, parsePagination } from '../../helpers/pagination.js';
import { parsePositiveQuantity } from '../../helpers/quantity-rules.js';
import {
    InventoryMessages,
    successResponse,
    errorResponse,
} from '../../helpers/inventory-messages.js';

const productSelect = 'name category price existences isActive';

const buildOutputFilter = (query = {}) => {
    const filter = {};

    if (query.productId) {
        filter.productId = query.productId;
    }

    if (query.isActive !== undefined && query.isActive !== '') {
        filter.isActive = query.isActive === 'true' || query.isActive === true;
    } else {
        filter.isActive = true;
    }

    if (query.from || query.to) {
        filter.createdAt = {};
        if (query.from) filter.createdAt.$gte = new Date(query.from);
        if (query.to) filter.createdAt.$lte = new Date(query.to);
    }

    return filter;
};

export const createOutput = async (req, res) => {
    try {
        const { productId, note } = req.body;
        const quantityCheck = parsePositiveQuantity(req.body.quantity);

        if (!quantityCheck.valid) {
            return errorResponse(res, 400, quantityCheck.message);
        }

        const { quantity } = quantityCheck;

        // Descuento atómico solo si hay stock suficiente y el producto está activo
        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: productId,
                isActive: true,
                existences: { $gte: quantity },
            },
            { $inc: { existences: -quantity } },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            const product = await Product.findById(productId);

            if (!product) {
                return errorResponse(res, 404, InventoryMessages.PRODUCT_NOT_FOUND, {
                    error: 'PRODUCT_NOT_FOUND',
                });
            }

            if (!product.isActive) {
                return errorResponse(res, 400, InventoryMessages.OUTPUT_INACTIVE_PRODUCT, {
                    error: 'PRODUCT_INACTIVE',
                });
            }

            return errorResponse(res, 400, InventoryMessages.OUTPUT_INSUFFICIENT_STOCK, {
                error: 'INSUFFICIENT_STOCK',
                available: product.existences,
                requested: quantity,
            });
        }

        try {
            const output = await Output.create({
                productId,
                quantity,
                note: note || '',
                createdBy: req.account?.id || null,
            });

            return successResponse(res, 201, InventoryMessages.OUTPUT_SUCCESS, {
                output,
                product: updatedProduct,
            });
        } catch (saveError) {
            // Compensación: devolver stock si falla el registro del movimiento
            await Product.findByIdAndUpdate(productId, {
                $inc: { existences: quantity },
            });
            throw saveError;
        }
    } catch (error) {
        console.error('Error al registrar salida:', error.message);
        return errorResponse(res, 400, InventoryMessages.OUTPUT_ERROR, {
            error: error.message,
        });
    }
};

export const getOutputs = async (req, res) => {
    try {
        const filter = buildOutputFilter(req.query);
        const { page, limit, skip, paginated } = parsePagination(req.query);

        const query = Output.find(filter)
            .populate('productId', productSelect)
            .sort({ createdAt: -1 });

        const [outputs, total] = await Promise.all([
            paginated ? query.skip(skip).limit(limit).lean() : query.lean(),
            Output.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            total,
            ...(paginated && { pagination: buildPaginatedMeta({ page, limit, total }) }),
            outputs,
        });
    } catch (error) {
        console.error('Error al listar salidas:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las salidas',
            error: error.message,
        });
    }
};

export const getOutputById = async (req, res) => {
    try {
        const output = await Output.findById(req.params.id)
            .populate('productId', productSelect)
            .lean();

        if (!output) {
            return res.status(404).json({
                success: false,
                message: 'Salida no encontrada',
                error: 'OUTPUT_NOT_FOUND',
            });
        }

        return res.status(200).json({
            success: true,
            output,
        });
    } catch (error) {
        console.error('Error al obtener salida:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la salida',
            error: error.message,
        });
    }
};
