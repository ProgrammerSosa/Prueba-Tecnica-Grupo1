import axios from 'axios';

/**
 * Error tipado para fallas al comunicarse con el Servicio A (inventario).
 * `statusCode` y `code` son consumidos por el errorHandler global
 * (middlewares/handle-errors.js), que arma la respuesta JSON consistente.
 */
export class InventoryServiceError extends Error {
    constructor(message, statusCode = 503, code = 'SERVICE_A_UNAVAILABLE') {
        super(message);
        this.name = 'InventoryServiceError';
        this.statusCode = statusCode;
        this.code = code;
    }
}

// Cliente perezoso: las variables de entorno se cargan con dotenv en index.js
// DESPUÉS de evaluarse los imports, por lo que no se puede leer process.env
// a nivel de módulo.
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

// El Servicio A puede responder un array plano o un envelope { success, data };
// se aceptan las variantes más comunes para no acoplarse a su formato exacto.
const normalizeProducts = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.products)) return payload.data.products;
    if (Array.isArray(payload?.products)) return payload.products;
    return null;
};

/**
 * Obtiene la lista de productos del Servicio A vía HTTP, reenviando el JWT
 * del solicitante (los endpoints del Servicio A también están protegidos).
 *
 * Contrato esperado del producto: { _id, name, category, price, stock }
 *
 * @param {string} token JWT crudo del solicitante (req.token)
 * @returns {Promise<Array<{_id: string, name: string, category: string, price: number, stock: number}>>}
 * @throws {InventoryServiceError} 503 si el Servicio A no responde,
 *         401 si rechaza las credenciales, 502 si responde un formato inesperado.
 */
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

        // Sin respuesta (servicio caído, timeout, DNS) o error 4xx/5xx genérico
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

/**
 * Umbral por defecto para considerar un producto con stock bajo.
 * Configurable con LOW_STOCK_THRESHOLD; acepta 0 como valor válido.
 */
export const getDefaultThreshold = () => {
    const threshold = Number(process.env.LOW_STOCK_THRESHOLD);
    return Number.isInteger(threshold) && threshold >= 0 ? threshold : 5;
};
