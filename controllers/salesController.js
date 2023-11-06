import salesModel from '../models/salesModel.js'; 

// Create a sale
export const createSaleController = async (req, res) => {
  try {
    const sale = new salesModel(req.body); 
    const savedSale = await sale.save();
    res.status(201).send(savedSale);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAllSalesController = async (req, res) => {
  try {
    const sales = await salesModel.find();
    res.json(sales);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const clearSalesController = async (req, res) => {
  try {
    // Delete the sales from your database using Mongoose
    await Sale.deleteMany({ saleDate: { $gte: req.body.startDate, $lte: req.body.endDate } });
    res.status(200).send('Sales cleared successfully');
  } catch (error) {
    res.status(500).send('Error clearing sales: ' + error.message);
  }
};

export const generateXReport = async (req, res) => {

};


export const generateZReport = async (req, res) => {

};
