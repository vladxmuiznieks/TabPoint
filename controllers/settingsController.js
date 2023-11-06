import settingsModel from '../models/settingsModel.js'; 

exports.updateSettings = async (req, res) => {
    try {
      const updatedSettings = await SettingsModel.findOneAndUpdate(
        { /* query */ }, 
        req.body, 
        { new: true }
      );
  
      if (!updatedSettings) {
        return res.status(404).send('Settings not found');
      }
  
      res.send(updatedSettings);
    } catch (error) {
      res.status(500).send('Error updating settings: ' + error.message);
    }
  };