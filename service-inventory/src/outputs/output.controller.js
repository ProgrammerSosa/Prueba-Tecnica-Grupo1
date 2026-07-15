import Output from './output.model.js';
import Product from '../products/product.model.js';
import { parsePositiveQuantity } from '../../helpers/quantity-rules.js';
import {
    InventoryMessages,
    successResponse,
    errorResponse,
} from '../../helpers/inventory-messages.js';

export const createOutput = async (req, res) => {
    try {
        const { productId, note } = req.body;
        const quantityCheck = parsePositiveQuantity(req.body.quantity);

        if (!quantityCheck.valid) {
            return errorResponse(res, 400, quantityCheck.message);
        }

        const { quantity } = quantityCheck;
        const product = await Product.findById(productId);

        if (!product) {
            return errorResponse(res, 404, InventoryMessages.PRODUCT_NOT_FOUND);
        }

        if (!product.isActive) {
            return errorResponse(res, 400, InventoryMessages.OUTPUT_INACTIVE_PRODUCT);
        }

        if (quantity > product.existences) {
            return errorResponse(res, 400, InventoryMessages.OUTPUT_INSUFFICIENT_STOCK, {
                error: 'INSUFFICIENT_STOCK',
                available: product.existences,
                requested: quantity,
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $inc: { existences: -quantity } },
            { new: true, runValidators: true }
        );

        const output = new Output({
            productId,
            quantity,
            note: note || '',
            createdBy: req.account?.id || null,
        });

        await output.save();

        return successResponse(res, 201, InventoryMessages.OUTPUT_SUCCESS, {
            output,
            product: updatedProduct,
        });
    } catch (error) {
        return errorResponse(res, 400, InventoryMessages.OUTPUT_ERROR, {
            error: error.message,
        });
    }
};
