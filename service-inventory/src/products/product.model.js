'use strict';

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede tener más de 100 caracteres'],
    },
    category: {
        type: String,
        required: [true, 'La categoría del producto es obligatoria'],
        trim: true,
        maxLength: [50, 'La categoría no puede tener más de 50 caracteres'],
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
        type: Number,
        required: [true, 'La existencia del producto es obligatoria'],
        min: [0, 'La existencia no puede ser negativa'],
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

export default mongoose.model('Product', productSchema);
