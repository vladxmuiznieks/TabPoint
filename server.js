import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import "colors";
import menuItemRoutes from './routes/menuItemRoutes.js';





import connectDB from './config/config.js';


dotenv.config();

connectDB();

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// routes
app.use('/api/products', menuItemRoutes);

// port
const PORT = 5000 || process.env.PORT 

// listen
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`.green.bold);
});
