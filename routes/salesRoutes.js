import express from 'express';
import { createSaleController } from '../controllers/salesController.js';

const router = express.Router();

// Create a sale
router.post('/', createSaleController);


export default router;
