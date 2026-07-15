'use strict';

import Entry from './entry.model.js';
import Product from '../products/product.model.js';
import { buildPaginatedMeta, parsePagination } from '../../helpers/pagination.js';
import { parsePositiveQuantity } from '../../helpers/quantity-rules.js';
import {
    InventoryMessages,
    successResponse,
    errorResponse,
} from '../../helpers/inventory-messages.js';

const productSelect = 'name category price existences isActive';

const buildEntryFilter = (query = {}) => {
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

export const createEntry = async (req, res) => {
    try {
        const { productId, note } = req.body;
        const quantityCheck = parsePositiveQuantity(req.body.quantity);

        if (!quantityCheck.valid) {
            return errorResponse(res, 400, quantityCheck.message);
        }

        const { quantity } = quantityCheck;

        // Actualización atómica: evita condiciones de carrera y verifica producto activo
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, isActive: true },
            { $inc: { existences: quantity } },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            const product = await Product.findById(productId);

            if (!product) {
                return errorResponse(res, 404, InventoryMessages.PRODUCT_NOT_FOUND, {
                    error: 'PRODUCT_NOT_FOUND',
                });
            }

            return errorResponse(res, 400, InventoryMessages.ENTRY_INACTIVE_PRODUCT, {
                error: 'PRODUCT_INACTIVE',
            });
        }

        try {
            const entry = await Entry.create({
                productId,
                quantity,
                note: note || '',
                createdBy: req.account?.id || null,
            });

            return successResponse(res, 201, InventoryMessages.ENTRY_SUCCESS, {
                entry,
                product: updatedProduct,
            });
        } catch (saveError) {
            // Compensación si falla el registro del movimiento
            await Product.findByIdAndUpdate(productId, {
                $inc: { existences: -quantity },
            });
            throw saveError;
        }
    } catch (error) {
        console.error('Error al registrar entrada:', error.message);
        return errorResponse(res, 400, InventoryMessages.ENTRY_ERROR, {
            error: error.message,
        });
    }
};

export const getEntries = async (req, res) => {
    try {
        const filter = buildEntryFilter(req.query);
        const { page, limit, skip, paginated } = parsePagination(req.query);

        const query = Entry.find(filter)
            .populate('productId', productSelect)
            .sort({ createdAt: -1 });

        const [entries, total] = await Promise.all([
            paginated ? query.skip(skip).limit(limit).lean() : query.lean(),
            Entry.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            total,
            ...(paginated && { pagination: buildPaginatedMeta({ page, limit, total }) }),
            entries,
        });
    } catch (error) {
        console.error('Error al listar entradas:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las entradas',
            error: error.message,
        });
    }
};

export const getEntryById = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id)
            .populate('productId', productSelect)
            .lean();

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Entrada no encontrada',
                error: 'ENTRY_NOT_FOUND',
            });
        }

        return res.status(200).json({
            success: true,
            entry,
        });
    } catch (error) {
        console.error('Error al obtener entrada:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la entrada',
            error: error.message,
        });
    }
};
