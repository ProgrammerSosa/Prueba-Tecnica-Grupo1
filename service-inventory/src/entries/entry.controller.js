import Entry from './entry.model.js';
import Product from '../products/product.model.js';
import { parsePositiveQuantity } from '../../helpers/quantity-rules.js';
import {
    InventoryMessages,
    successResponse,
    errorResponse,
} from '../../helpers/inventory-messages.js';

export const createEntry = async (req, res) => {
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
            return errorResponse(res, 400, InventoryMessages.ENTRY_INACTIVE_PRODUCT);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $inc: { existences: quantity } },
            { new: true, runValidators: true }
        );

        const entry = new Entry({
            productId,
            quantity,
            note: note || '',
            createdBy: req.account?.id || null,
        });

        await entry.save();

        return successResponse(res, 201, InventoryMessages.ENTRY_SUCCESS, {
            entry,
            product: updatedProduct,
        });
    } catch (error) {
        return errorResponse(res, 400, InventoryMessages.ENTRY_ERROR, {
            error: error.message,
        });
    }
};
