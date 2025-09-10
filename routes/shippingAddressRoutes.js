import express from 'express'
import {
  createShippingAddress,
  getAllShippingAddresses,
  getShippingAddress,
} from '../controllers/shippingAddressController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


// shipping address routes
const shippingAddressRoutes = express.Router();

shippingAddressRoutes.post('/', isLoggedIn, createShippingAddress);
shippingAddressRoutes.get('/', isLoggedIn, getAllShippingAddresses);
shippingAddressRoutes.get('/:addressnickname', isLoggedIn, getShippingAddress);
shippingAddressRoutes.put( '/:addressnickname', isLoggedIn, createShippingAddress);
shippingAddressRoutes.delete( '/:addressnickname', isLoggedIn, createShippingAddress);


export default shippingAddressRoutes;