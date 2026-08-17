import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Property from '../models/Property.js';

const initialProperty = {
  type: 'flat',
  title: '1 BHK Fully Furnished Builder Floor near Metro',
  location: 'Dwarka Mor, Delhi',
  price: '₹ 18,00,000',
  image: '',
  description:
    'Independent / Builder Floor | 1 BHK | Super Area: 400 sqft | Carpet Area: 380 sqft | 1 Bathroom | Fully Furnished | Ready to Move | Listed by Builder | West Facing | Bike Parking available (no car parking) | Maintenance: ₹0/month | Total Floors: 4 | Lift available | Loan available | Near metro.',
};

const seed = async () => {
  await connectDB();
  const count = await Property.countDocuments();
  if (count === 0) {
    await Property.create(initialProperty);
    console.log('Seeded initial property.');
  } else {
    console.log('Properties already exist, skipping seed.');
  }
  await mongoose.disconnect();
  process.exit(0);
};

seed();
