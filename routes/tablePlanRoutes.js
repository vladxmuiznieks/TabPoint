import express from 'express';
import {
    getTablePlanController,
    createTablePlanController,
    // updateTablePlanController,
    upsertTablePlanController,
    deleteTableController
} from '../controllers/tablePlanController.js';

const router = express.Router();

// Get the table plan
router.get("/", getTablePlanController);

// Create a new table plan
router.post("/", createTablePlanController);

// Update the table plan
// router.put("/", updateTablePlanController);

// Delete a specific table from the table plan
router.delete("/:tableId", deleteTableController);

router.post("/", upsertTablePlanController);

export default router;
