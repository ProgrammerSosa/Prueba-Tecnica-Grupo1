import { Schema, model } from 'mongoose';

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
