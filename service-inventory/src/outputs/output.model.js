'use strict';

import mongoose from 'mongoose';

const outputSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'El ID del producto es obligatorio'],
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [0, 'La cantidad no puede ser un número negativo'],
        validate: {
            validator: (value) => typeof value === 'number' && value > 0,
            message: 'La cantidad no puede ser un número negativo ni cero',
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
}, {
    timestamps: true,
    versionKey: false,
});

outputSchema.index({ productId: 1 });
outputSchema.index({ createdAt: -1 });

export default mongoose.model('Output', outputSchema);
