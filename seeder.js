const dotenv = require('dotenv');
const connectDB = require('./config/config');
const menuItemModel = require('./models/menuItemModel');
const products = require('./utils/data');
require('colors');
dotenv.config();
connectDB();

const importData = async () => {
    try {
        await menuItemModel.deleteMany({});
        await menuItemModel.insertMany(products);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/config');
const menuItemModel = require('./models/menuItemModel');
const products = require('./utils/data');
require('colors');
dotenv.config();
connectDB();

const importData = async () => {
    try {
        await menuItemModel.deleteMany({});
        await menuItemModel.insertMany(products);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
}

importData();