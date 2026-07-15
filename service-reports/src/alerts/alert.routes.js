import { Router } from 'express';
import { query } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { checkValidators } from '../../middlewares/checkValidators.js';
import { getLowStockAlert, getOutOfStockAlert } from './alert.controller.js';

const router = Router();

const lowStockValidators = [
    query('threshold')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El threshold debe ser un número entero mayor o igual a 0')
        .toInt(),
    checkValidators,
];

// GET /api/v1/alerts/low-stock?threshold=5
router.get('/low-stock', validateJWT, lowStockValidators, getLowStockAlert);

// GET /api/v1/alerts/out-of-stock
router.get('/out-of-stock', validateJWT, getOutOfStockAlert);

export default router;
