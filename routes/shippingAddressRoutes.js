import express from 'express'
import {
  createShippingAddress,
  deleteShippingAddress,
  getAllShippingAddresses,
  getShippingAddress,
  updateShippingAddress,
} from '../controllers/shippingAddressController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


// shipping address routes
const shippingAddressRoutes = express.Router();

shippingAddressRoutes.post('/', isLoggedIn, createShippingAddress);
shippingAddressRoutes.get('/', isLoggedIn, getAllShippingAddresses);
shippingAddressRoutes.get('/:addressnickname', isLoggedIn, getShippingAddress);
shippingAddressRoutes.put( '/:addressnickname', isLoggedIn, updateShippingAddress);
shippingAddressRoutes.delete( '/:addressnickname', isLoggedIn, deleteShippingAddress);


export default shippingAddressRoutes;