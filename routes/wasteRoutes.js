const express = require('express');
const router = express.Router();
const WasteEntry = require('../models/WasteEntry'); 
const Product = require('../models/Product');  
const User = require('../models/User');  


router.post('/waste', async (req, res) => {
  try {
    const { itemId, percentageWasted, userPin } = req.body;
    

    const user = await User.findOne({ pin: userPin });
    if (!user) {
      return res.status(401).send('Invalid PIN');
    }

    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const costWasted = (product.cost * percentageWasted) / 100;
    
    const wasteEntry = new WasteEntry({
      item: itemId,
      percentageWasted,
      costWasted,
      responsibleUser: user._id
    });

    await wasteEntry.save();
    res.status(201).send(wasteEntry);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/waste-report', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const wasteEntries = await WasteEntry.find(query).populate('item').populate('responsibleUser');
    res.status(200).send(wasteEntries);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
