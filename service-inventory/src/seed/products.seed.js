'use strict';

import Product from '../products/product.model.js';

export const seedTempProductIfEmpty = async () => {
    try {
        const count = await Product.countDocuments();

        if (count > 0) {
            const existing = await Product.findOne({ name: 'Producto Temporal' });
            if (existing) {
                console.log(`Producto temporal ID: ${existing._id}`);
            }
            return;
        }

        console.log('Seeding producto temporal para pruebas de entradas...');

        const product = await Product.create({
            name: 'Producto Temporal',
            category: 'ALIMENTOS',
            price: 0,
            existences: 0,
            isActive: true,
        });

        console.log(`Producto temporal creado. ID: ${product._id}`);
        console.log('Usa este productId en POST /api/v1/entries (Postman)');
    } catch (error) {
        console.error('Error al ejecutar seed de productos:', error.message);
    }
};
