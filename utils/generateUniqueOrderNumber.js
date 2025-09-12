import Order from '../models/Order.js';

async function generateUniqueOrderNumber() {
  while (true) {
    // generate orderNumber
    const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
    const randomNumbers = Math.floor(1000 + Math.random() * 90000);
    const candidate = `${randomTxt}${randomNumbers}`;

    const exists = await Order.findOne({ orderNumber: candidate });
    if (!exists) return candidate;
  }
}

export default generateUniqueOrderNumber;
