import express from 'express';
import { getAllSalesController, createSaleController, clearSalesController } from '../controllers/salesController.js';

const router = express.Router();

// Create a sale
router.post('/', createSaleController);

router.get('/', getAllSalesController);

router.post('/clear', clearSalesController);

// router.get('/reports/x', generateXReport);

// router.get('/reports/z', generateZReport);


export default router;
