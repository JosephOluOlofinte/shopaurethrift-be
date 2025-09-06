import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/userRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import brandRoutes from '../routes/brandRoutes.js';
import colorRoutes from '../routes/colorRoutes.js';
import reviewRoutes from '../routes/reviewRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';

// connect database
dbConnect();

const app = express();
// pass incoming data to server
app.use(express.json());

// Routes
// API health check endpoint
app.get('/', (req, res, next) => {
  return res.status(200).json({
    status: 'Healthy',
    message:
      'Your connection is healthy, and you are now in the root directory!',
  });
});
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/categories/', categoryRoutes);
app.use('/api/v1/brands/', brandRoutes);
app.use('/api/v1/colors/', colorRoutes);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/orders/', orderRoutes);

export default app;
