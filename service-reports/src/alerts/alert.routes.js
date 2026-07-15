import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { lowStockValidator, outOfStockValidator } from '../../middlewares/alert-validators.js';
import { getLowStockAlert, getOutOfStockAlert } from './alert.controller.js';

const router = Router();

router.get('/low-stock', validateJWT, lowStockValidator, getLowStockAlert);

router.get('/out-of-stock', validateJWT, outOfStockValidator, getOutOfStockAlert);

export default router;
