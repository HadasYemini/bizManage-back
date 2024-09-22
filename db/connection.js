import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.MONGODB_URI;

mongoose.connect(DB_URI)
  .then((res) => console.log('Connected to mongoDb'))
  .catch((err) => console.error('MongoDb connection error:', err));