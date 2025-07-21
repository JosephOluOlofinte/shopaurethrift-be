import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import dbConnect from '../config/dbConnect.js';


const app = express();


// connect database
dbConnect();
export default app;
