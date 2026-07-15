'use strict';

import { Router } from 'express';
import {
    createProduct,
    getProducts,
    getProductsByNameOrCategory,
    getProductById,
    getLowStockProducts,
    getInventorySummary,
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
    validateListProducts,
    validateLowStock,
} from '../../middlewares/product-validators.js';

const router = Router();

router.post('/', validateCreateProduct, createProduct);

router.get('/', validateListProducts, getProducts);

router.get('/search', validateSearchProducts, getProductsByNameOrCategory);

router.get('/categories', getCategoriesList);

router.post('/categories', validateAddCategory, addCategory);

router.get('/low-stock', validateLowStock, getLowStockProducts);

router.get('/summary', validateLowStock, getInventorySummary);

router.get('/:id', validateGetProductById, getProductById);

router.put('/:id', validateUpdateProduct, updateProduct);

router.put('/:id/activate', validateProductStatusChange, activateProduct);

router.put('/:id/deactivate', validateProductStatusChange, deactivateProduct);

export default router;
