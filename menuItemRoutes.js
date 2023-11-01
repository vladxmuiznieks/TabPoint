// routes.js
import express from 'express';import { 
    getMenuItemController, addMenuItemController, deleteMenuItemController,
    getCategoryController, addCategoryController, deleteCategoryController,
    editMenuItemController
  } from '../controllers/menuItemController.js';

const router = express.Router();

router.get("/getproducts", getMenuItemController);
router.post("/addproducts", addMenuItemController);
router.delete("/deleteproduct/:id", deleteMenuItemController);
router.put("/editproduct/:id", editMenuItemController);


router.get("/getcategories", getCategoryController);
router.post("/addcategory", addCategoryController);
router.delete("/deletecategory/:id", deleteCategoryController);


export default router;

