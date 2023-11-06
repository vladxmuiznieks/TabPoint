import express from 'express';
import Settings from '../models/settingsModel.js'; 

const router = express.Router();

// Get settings
router.get('/', async (req, res) => { 
  try {
    const settings = await Settings.findOne({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/', async (req, res) => {
    try {
     
      const settings = await Settings.findOne();
      if (!settings) {
       
        return res.status(404).send('Settings not found');
      }
  
      // Update the settings with request body
      settings.barName = req.body.barName || settings.barName;
      settings.thankYouMessage = req.body.thankYouMessage || settings.thankYouMessage;
  
      // Save the updated settings
      const updatedSettings = await settings.save();
  
      // Send updated settings
      res.status(200).json(updatedSettings);
    } catch (error) {
      // If error occurs, send back error
      res.status(500).send(error.message);
    }
  });

export default router;
