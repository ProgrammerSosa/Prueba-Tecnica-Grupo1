'use strict';

import { Router } from 'express';
import {
    getHistory,
    getEntryHistory,
    getOutputHistory,
} from './history.controller.js';
import { validateHistoryQuery } from '../../middlewares/history-validators.js';

const router = Router();

router.get('/', validateHistoryQuery, getHistory);
router.get('/entries', validateHistoryQuery, getEntryHistory);
router.get('/outputs', validateHistoryQuery, getOutputHistory);

export default router;
