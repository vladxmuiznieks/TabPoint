import mongoose from 'mongoose';
const tabItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
}, {
    _id: false
});
const tabSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateClosed: {
        type: Date
    },
    items: {
        type: [tabItemSchema],
        required: true
    },
    totalAmountDue: {
        type: Number,
        required: true
    },
    amountPaid:  {
        type: Number,
        required: false,

    },
    tableNo: {
        type: String,
    },
    changeOwed: {
        type: Number,
        required: true,
    },
});

const tabModel = mongoose.model('tabs', tabSchema);

export default tabModel;