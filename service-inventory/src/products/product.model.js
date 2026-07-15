'use strict';

import mongoose from 'mongoose';
import { getCategories, isValidCategory } from '../../helpers/product-categories.js';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            unique: true,
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [100, 'El nombre no puede tener más de 100 caracteres'],
        },
        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            uppercase: true,
            trim: true,
            validate: {
                validator: (value) => isValidCategory(value),
                message: () =>
                    `Categoría no válida. Categorías permitidas: ${getCategories().join(', ')}`,
            },
        },
        price: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo'],
            default: 0,
        },
        existences: {
            type: Number,
            default: 0,
            min: [0, 'Las existencias no pueden ser negativas'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Alias de stock para clientes/reportes que esperan `stock` en lugar de `existences`
productSchema.virtual('stock').get(function stockAlias() {
    return this.existences;
});

productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ existences: 1 });
productSchema.index({ name: 1 });

export default mongoose.model('Product', productSchema);
