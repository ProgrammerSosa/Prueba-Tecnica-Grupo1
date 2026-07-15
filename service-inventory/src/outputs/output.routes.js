import { Router } from 'express';
import { createOutput } from './output.controller.js';
import { validateCreateOutput } from '../../middlewares/output-validators.js';

const router = Router();

router.post(
    '/',
    validateCreateOutput,
    createOutput
);

export default router;
