export const createOutput = async (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Registrar salida de inventario aún no está implementado',
    });
};
