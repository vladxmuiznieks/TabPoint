
import express from 'express';
import { 
    getMenuItemController, addMenuItemController, deleteMenuItemController,
    getCategoryController, addCategoryController, deleteCategoryController,
    editMenuItemController
  } from '../controllers/menuItemController.js';

const router = express.Router();

router.get("/getproducts", getMenuItemController);
router.post("/addproducts", addMenuItemController);
router.delete("/deleteproduct/:id", deleteMenuItemController);
router.put("/editproduct/:id", editMenuItemController);

router.get("/getproductsbycategory/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/getcategories", getCategoryController);
router.post("/addcategory", addCategoryController);
router.delete("/deletecategory/:id", deleteCategoryController);


export default router;

