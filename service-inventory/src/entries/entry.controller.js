import Entry from './entry.model.js';
import Product from '../products/product.model.js';

export const createEntry = async (req, res) => {
    try {
        const { productId, quantity, note } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
        }

        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: 'No se pueden registrar entradas para un producto inactivo',
            });
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

        res.status(201).json({
            success: true,
            message: 'Entrada de inventario registrada exitosamente',
            data: {
                entry,
                product: updatedProduct,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al registrar la entrada de inventario',
            error: error.message,
        });
    }
};
