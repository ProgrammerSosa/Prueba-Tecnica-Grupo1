'use strict';

import { Router } from 'express';
import { createOutput, getOutputs, getOutputById } from './output.controller.js';
import {
    validateCreateOutput,
    validateListOutputs,
    validateGetOutputById,
} from '../../middlewares/output-validators.js';

const router = Router();

router.post('/', validateCreateOutput, createOutput);

router.get('/', validateListOutputs, getOutputs);

router.get('/:id', validateGetOutputById, getOutputById);

export default router;
