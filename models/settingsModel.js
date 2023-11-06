import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  barName: String,
  thankYouMessage: String,
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings; 
