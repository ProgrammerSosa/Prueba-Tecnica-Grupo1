import { Schema, model } from 'mongoose';

/**
 * CONTRATO COMPARTIDO con service-inventory (Servicio A).
 *
 * Colección: 'outputs' en la base compartida — el Servicio A ESCRIBE las
 * salidas de inventario (POST /outputs) y este servicio solo las LEE para
 * calcular los productos más vendidos.
 *
 * Campos mínimos acordados (inglés, camelCase):
 *   product:  ObjectId → referencia al producto del Servicio A
 *   quantity: Number   → unidades que salieron del inventario (>= 1)
 *   createdAt/updatedAt: timestamps automáticos
 *
 * Campos adicionales que agregue el Servicio A (reason, user, etc.)
 * son ignorados aquí.
 */
const outputSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        timestamps: true,
        collection: 'outputs',
    }
);

export default model('Output', outputSchema);
