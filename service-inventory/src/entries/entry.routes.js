'use strict';

import { Router } from 'express';
import { createEntry, getEntries, getEntryById } from './entry.controller.js';
import {
    validateCreateEntry,
    validateListEntries,
    validateGetEntryById,
} from '../../middlewares/entry-validators.js';

const router = Router();

router.post('/', validateCreateEntry, createEntry);

router.get('/', validateListEntries, getEntries);

router.get('/:id', validateGetEntryById, getEntryById);

export default router;
