import dotenv from 'dotenv'
dotenv.config()
import cloudnaryPackage from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary'


const cloudinary = cloudnaryPackage.v2;


// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create storage engine
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    params: {
        folder: 'shopaurethrift',
    },
});

// init multer with storage engine
const upload = multer({
    storage,
});

export default upload;