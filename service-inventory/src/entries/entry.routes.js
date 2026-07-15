import { Router } from 'express';
import { createEntry } from './entry.controller.js';
import { validateCreateEntry } from '../../middlewares/entry-validators.js';

const router = Router();

router.post(
    '/',
    validateCreateEntry,
    createEntry
);

export default router;
