import salesModel from '../models/salesModel.js';

// Create a sale
export const createSaleController = async (req, res) => {
  try {
    const sale = new SalesModel(req.body);
    const savedSale = await sale.save();
    res.status(201).send(savedSale);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


