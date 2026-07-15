'use strict';

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre de la categoría es obligatorio'],
            unique: true,
            uppercase: true,
            trim: true,
            minlength: [2, 'La categoría debe tener al menos 2 caracteres'],
            maxlength: [50, 'La categoría no puede tener más de 50 caracteres'],
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

categorySchema.index({ isActive: 1 });

export default mongoose.model('Category', categorySchema);
