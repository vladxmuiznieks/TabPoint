import { Category, Product } from '../models/menuItemModel.js';



export const getMenuItemController = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


export const addMenuItemController = async (req, res) => {
    try {
        const newMenuItem = new Product(req.body);  // Using the Product model
        await newMenuItem.save();
        res.status(201).json({ message: "Product added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

export const editMenuItemController = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
    }
  };
  


export const deleteMenuItemController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Product.findByIdAndDelete(id);
        
        if (result) {
            res.status(200).send({ message: 'Product deleted successfully', data: result });
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};

export const getCategoryController = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const addCategoryController = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ message: "Category added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Category.findByIdAndDelete(id);
        
        if (result) {
            res.status(200).send({ message: 'Category deleted successfully', data: result });
        } else {
            res.status(404).send({ message: 'Category not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};





