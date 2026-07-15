'use strict';

import { Router } from 'express';
import {
    getHistory,
    getEntryHistory,
    getOutputHistory,
} from './history.controller.js';

const router = Router();

router.get('/', getHistory);
router.get('/entries', getEntryHistory);
router.get('/outputs', getOutputHistory);

export default router;
