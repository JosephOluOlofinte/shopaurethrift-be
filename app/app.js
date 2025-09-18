import dotenv from 'dotenv';
dotenv.config();
import express, { response } from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/userRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import brandRoutes from '../routes/brandRoutes.js';
import colorRoutes from '../routes/colorRoutes.js';
import reviewRoutes from '../routes/reviewRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import shippingAddressRoutes from '../routes/shippingAddressRoutes.js';
import webhookRoutes from '../routes/webhookRoutes.js';
import couponRoutes from '../routes/couponRoutes.js';

// connect database
dbConnect();
const app = express();

// load web hooks
app.use('/api/v1/webhooks/', webhookRoutes);



// pass incoming data to server as json
app.use(express.json());


// API health check endpoint
app.get('/', (req, res, next) => {
  return res.status(200).json({
    status: 'Healthy',
    message:
      'Your connection is healthy. You can now do whatever you want!',
  });
});

// load routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/categories/', categoryRoutes);
app.use('/api/v1/brands/', brandRoutes);
app.use('/api/v1/colors/', colorRoutes);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/orders/', orderRoutes);
app.use('/api/v1/shipping-addresses/', shippingAddressRoutes);
app.use('/api/v1/coupons/', couponRoutes);

export default app;
