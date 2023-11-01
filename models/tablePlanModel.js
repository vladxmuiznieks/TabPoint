// tablePlanModel.js

import mongoose from 'mongoose';

const tablePlanSchema = new mongoose.Schema({
    tables: [{
        shape: String, 
        coordinates: [Number], 
        tableNumber: Number
    }]
});

const tablePlanModel = mongoose.model('tablePlans', tablePlanSchema);

export default tablePlanModel;
