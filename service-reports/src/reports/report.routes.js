import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { topProductsValidator } from '../../middlewares/report-validators.js';
import {
    getTopProducts,
    getCategoriesReport,
    getSummaryReport,
    exportSummary,
} from './report.controller.js';

const router = Router();

router.get('/top-products', validateJWT, topProductsValidator, getTopProducts);

router.get('/categories', validateJWT, getCategoriesReport);

router.get('/summary/export', validateJWT, exportSummary);

router.get('/summary', validateJWT, getSummaryReport);

export default router;
