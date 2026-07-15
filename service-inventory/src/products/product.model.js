'use strict';

import mongoose from 'mongoose';
import { getCategories, isValidCategory } from '../../helpers/product-categories.js';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            unique: [true, 'El nombre del producto debe de ser único'],
        },
        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            uppercase: true,
            validate: {
                validator: (value) => isValidCategory(value),
                message: () =>
                    `Categoría no válida. Categorías permitidas: ${getCategories().join(', ')}`,
            },
        },
        price: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            default: 0,
        },
        existences: {
            type: Number,
            default: 0,
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

export default mongoose.model('Product', productSchema);
