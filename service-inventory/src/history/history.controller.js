'use strict';

import Entry from '../entries/entry.model.js';
import Output from '../outputs/output.model.js';
import { buildPaginatedMeta, parsePagination } from '../../helpers/pagination.js';

const productSelect = 'name category price existences isActive';

const mapMovement = (doc, type) => ({
    _id: doc._id,
    type,
    productId: doc.productId,
    quantity: doc.quantity,
    note: doc.note,
    createdBy: doc.createdBy,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});

const buildDateFilter = (query = {}) => {
    const filter = { isActive: true };

    if (query.productId) {
        filter.productId = query.productId;
    }

    if (query.from || query.to) {
        filter.createdAt = {};
        if (query.from) filter.createdAt.$gte = new Date(query.from);
        if (query.to) filter.createdAt.$lte = new Date(query.to);
    }

    return filter;
};

const applyClientPagination = (items, query) => {
    const { page, limit, skip, paginated } = parsePagination(query);

    if (!paginated) {
        return {
            items,
            meta: buildPaginatedMeta({ page: 1, limit: null, total: items.length }),
        };
    }

    const total = items.length;
    return {
        items: items.slice(skip, skip + limit),
        meta: buildPaginatedMeta({ page, limit, total }),
        paginated: true,
    };
};

export const getHistory = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const type = String(req.query.type || '').toUpperCase();

        const fetchEntries = !type || type === 'ENTRY';
        const fetchOutputs = !type || type === 'OUTPUT';

        if (type && type !== 'ENTRY' && type !== 'OUTPUT') {
            return res.status(400).json({
                success: false,
                message: 'El tipo debe ser ENTRY u OUTPUT',
                error: 'INVALID_TYPE',
            });
        }

        const [entries, outputs] = await Promise.all([
            fetchEntries
                ? Entry.find(filter)
                      .populate('productId', productSelect)
                      .sort({ createdAt: -1 })
                      .lean()
                : Promise.resolve([]),
            fetchOutputs
                ? Output.find(filter)
                      .populate('productId', productSelect)
                      .sort({ createdAt: -1 })
                      .lean()
                : Promise.resolve([]),
        ]);

        const history = [
            ...entries.map((entry) => mapMovement(entry, 'ENTRY')),
            ...outputs.map((output) => mapMovement(output, 'OUTPUT')),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const { items, meta, paginated } = applyClientPagination(history, req.query);

        return res.status(200).json({
            success: true,
            total: meta.total,
            ...(paginated && { pagination: meta }),
            totals: {
                entries: entries.length,
                outputs: outputs.length,
            },
            filters: {
                type: type || null,
                productId: req.query.productId || null,
                from: req.query.from || null,
                to: req.query.to || null,
            },
            history: items,
        });
    } catch (error) {
        console.error('Error al obtener historial:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de inventario',
            error: error.message,
        });
    }
};

export const getEntryHistory = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const { page, limit, skip, paginated } = parsePagination(req.query);

        const query = Entry.find(filter)
            .populate('productId', productSelect)
            .sort({ createdAt: -1 });

        const [entries, total] = await Promise.all([
            paginated ? query.skip(skip).limit(limit).lean() : query.lean(),
            Entry.countDocuments(filter),
        ]);

        const history = entries.map((entry) => mapMovement(entry, 'ENTRY'));

        return res.status(200).json({
            success: true,
            total,
            ...(paginated && { pagination: buildPaginatedMeta({ page, limit, total }) }),
            history,
        });
    } catch (error) {
        console.error('Error al obtener historial de entradas:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de entradas',
            error: error.message,
        });
    }
};

export const getOutputHistory = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const { page, limit, skip, paginated } = parsePagination(req.query);

        const query = Output.find(filter)
            .populate('productId', productSelect)
            .sort({ createdAt: -1 });

        const [outputs, total] = await Promise.all([
            paginated ? query.skip(skip).limit(limit).lean() : query.lean(),
            Output.countDocuments(filter),
        ]);

        const history = outputs.map((output) => mapMovement(output, 'OUTPUT'));

        return res.status(200).json({
            success: true,
            total,
            ...(paginated && { pagination: buildPaginatedMeta({ page, limit, total }) }),
            history,
        });
    } catch (error) {
        console.error('Error al obtener historial de salidas:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de salidas',
            error: error.message,
        });
    }
};
