'use strict';

import { Router } from 'express';
import {
    createProduct,
    getProducts,
    getProductsByNameOrCategory,
    getProductById,
    updateProduct,
    activateProduct,
    deactivateProduct,
    addCategory,
    getCategoriesList,
} from './product.controller.js';
import {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductStatusChange,
    validateGetProductById,
    validateSearchProducts,
    validateAddCategory,
} from '../../middlewares/product-validators.js';

const router = Router();

router.post('/', validateCreateProduct, createProduct);

router.get('/', getProducts);

router.get('/search', validateSearchProducts, getProductsByNameOrCategory);

router.get('/categories', getCategoriesList);

router.post('/categories', validateAddCategory, addCategory);

router.get('/:id', validateGetProductById, getProductById);

router.put('/:id', validateUpdateProduct, updateProduct);

router.put('/:id/activate', validateProductStatusChange, activateProduct);

router.put('/:id/deactivate', validateProductStatusChange, deactivateProduct);

export default router;
