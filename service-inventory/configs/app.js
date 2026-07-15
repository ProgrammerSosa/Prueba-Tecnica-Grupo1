import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import productRoutes from '../src/products/product.routes.js';
import entryRoutes from '../src/entries/entry.routes.js';
import outputRoutes from '../src/outputs/output.routes.js';
import historyRoutes from '../src/history/history.routes.js';
import { seedTempProductIfEmpty } from '../src/seed/products.seed.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(requestLimit);
    app.use(morgan('dev'));
};

const routes = (app) => {

    app.get(`${BASE_PATH}/health`, (request, response) => {
        response.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'Service Inventory - Gestión de Inventario',
            version: 'sprint-3',
            endpoints: {
                products: `${BASE_PATH}/products`,
                entries: `${BASE_PATH}/entries`,
                outputs: `${BASE_PATH}/outputs`,
            },
        });
    });


    app.use(`${BASE_PATH}/products`, productRoutes);
    app.use(`${BASE_PATH}/entries`, entryRoutes);
    app.use(`${BASE_PATH}/outputs`, outputRoutes);
    app.use(`${BASE_PATH}/history`, historyRoutes);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado',
        });
    });
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.set('trust proxy', 1);

    try {
        await dbConnection();
        await seedTempProductIfEmpty();

        middlewares(app);
        routes(app);

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Servidor de inventario corriendo en el puerto ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    } catch (error) {
        console.error(`Error al iniciar servidor: ${error.message}`);
        process.exit(1);
    }
};
