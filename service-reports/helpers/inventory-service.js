import axios from 'axios';

export class InventoryServiceError extends Error {
    constructor(message, statusCode = 503, code = 'SERVICE_A_UNAVAILABLE') {
        super(message);
        this.name = 'InventoryServiceError';
        this.statusCode = statusCode;
        this.code = code;
    }
}

let client;

const getClient = () => {
    if (!client) {
        client = axios.create({
            baseURL: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3005/api/v1',
            timeout: 5000,
        });
    }
    return client;
};

const normalizeProducts = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.products)) return payload.data.products;
    if (Array.isArray(payload?.products)) return payload.products;
    return null;
};

export const fetchProducts = async (token) => {
    let response;

    try {
        response = await getClient().get('/products', {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        if (error.response) {
            const { status } = error.response;

            if (status === 401 || status === 403) {
                throw new InventoryServiceError(
                    'El servicio de inventario rechazó las credenciales proporcionadas',
                    401,
                    'INVENTORY_AUTH_ERROR'
                );
            }
        }

        throw new InventoryServiceError(
            'El servicio de inventario no está disponible en este momento, intenta de nuevo más tarde',
            503,
            'SERVICE_A_UNAVAILABLE'
        );
    }

    const products = normalizeProducts(response.data);

    if (!products) {
        throw new InventoryServiceError(
            'El servicio de inventario devolvió una respuesta inesperada',
            502,
            'SERVICE_A_BAD_RESPONSE'
        );
    }

    return products;
};

export const getDefaultThreshold = () => {
    const threshold = Number(process.env.LOW_STOCK_THRESHOLD);
    return Number.isInteger(threshold) && threshold >= 0 ? threshold : 5;
};
