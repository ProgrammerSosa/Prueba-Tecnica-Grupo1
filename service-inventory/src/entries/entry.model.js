'use strict';

import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'El ID del producto es obligatorio'],
        },
        quantity: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'La cantidad debe ser mayor a 0'],
            validate: {
                validator: (value) => Number.isInteger(value) && value > 0,
                message: 'La cantidad debe ser un entero mayor a 0',
            },
        },
        note: {
            type: String,
            trim: true,
            maxLength: [500, 'La nota no puede tener más de 500 caracteres'],
            default: '',
        },
        createdBy: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

entrySchema.index({ productId: 1, createdAt: -1 });
entrySchema.index({ createdAt: -1 });
entrySchema.index({ isActive: 1 });

export default mongoose.model('Entry', entrySchema);
