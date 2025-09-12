import express from 'express';
import { stripeWebhook } from '../controllers/webhooks.js';



const webhookRoutes = express.Router();

webhookRoutes.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook)


export default webhookRoutes;