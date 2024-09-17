import express from 'express';
import { getAllProducts, createProduct } from '../controllers/productController.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/create', upload.single('image'), createProduct);

export default router;