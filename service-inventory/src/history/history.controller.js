'use strict';

import Entry from '../entries/entry.model.js';
import Output from '../outputs/output.model.js';

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

export const getHistory = async (req, res) => {
    try {
        const [entries, outputs] = await Promise.all([
            Entry.find({ isActive: true })
                .populate('productId', productSelect)
                .sort({ createdAt: -1 })
                .lean(),
            Output.find({ isActive: true })
                .populate('productId', productSelect)
                .sort({ createdAt: -1 })
                .lean(),
        ]);

        const history = [
            ...entries.map((entry) => mapMovement(entry, 'ENTRY')),
            ...outputs.map((output) => mapMovement(output, 'OUTPUT')),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({
            success: true,
            total: history.length,
            totals: {
                entries: entries.length,
                outputs: outputs.length,
            },
            history,
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
        const entries = await Entry.find({ isActive: true })
            .populate('productId', productSelect)
            .sort({ createdAt: -1 })
            .lean();

        const history = entries.map((entry) => mapMovement(entry, 'ENTRY'));

        return res.status(200).json({
            success: true,
            total: history.length,
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
        const outputs = await Output.find({ isActive: true })
            .populate('productId', productSelect)
            .sort({ createdAt: -1 })
            .lean();

        const history = outputs.map((output) => mapMovement(output, 'OUTPUT'));

        return res.status(200).json({
            success: true,
            total: history.length,
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
