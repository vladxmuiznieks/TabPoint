import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
    tabId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tabs',
        required: false
    },
    tableNo: {
        type: String,
        required: false
    },
    
    
    items: [
        {
            name: { type: String, required: true },
            category: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmountDue: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    changeOwed: {
        type: Number,
        required: true
    },
    saleDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const salesModel = mongoose.model('Sales', salesSchema);

export default salesModel;
