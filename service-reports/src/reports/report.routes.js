import { Router } from 'express';
import { query } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { checkValidators } from '../../middlewares/checkValidators.js';
import {
    getTopProducts,
    getCategoriesReport,
    getSummaryReport,
} from './report.controller.js';

const router = Router();

const topProductsValidators = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('El limit debe ser un número entero entre 1 y 50')
        .toInt(),
    checkValidators,
];

// GET /api/v1/reports/top-products?limit=5
router.get('/top-products', validateJWT, topProductsValidators, getTopProducts);

// GET /api/v1/reports/categories
router.get('/categories', validateJWT, getCategoriesReport);

// GET /api/v1/reports/summary
router.get('/summary', validateJWT, getSummaryReport);

export default router;
