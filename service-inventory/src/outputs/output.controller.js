import Output from './output.model.js';
import Product from '../products/product.model.js';

export const createOutput = async (req, res) => {
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
                message: 'No se pueden registrar salidas para un producto inactivo',
            });
        }

        if (quantity > product.existences) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad de salida no puede ser mayor a la existencia del producto',
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

        res.status(201).json({
            success: true,
            message: 'Salida de inventario registrada exitosamente',
            data: {
                output,
                product: updatedProduct,
            },
        });
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: error.message || 'Datos de salida inválidos',
                error: error.name,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error al registrar la salida de inventario',
            error: error.message,
        });
    }
};

