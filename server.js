import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import "colors";
import menuItemRoutes from './routes/menuItemRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/config.js';
import tabRoutes from './routes/tabRoutes.js';
import tablePlanRoutes from './routes/tablePlanRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import settingsRoutes from './routes/settingsRoutes.js';

import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();
// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorMiddleware);

// routes
app.use('/api/products', menuItemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tabs',tabRoutes);
app.use('/api/table-plans',tablePlanRoutes);
app.use('/api/sales',salesRoutes);
app.use('/api/settings', settingsRoutes);

// port
const PORT = 5000 || process.env.PORT 

// listen
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`.green.bold);
});
