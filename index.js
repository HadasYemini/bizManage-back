import app from './app.js';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import userRouter from './controllers/user_routes.js';  

dotenv.config();
const isDevelopment = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || (isDevelopment ? 3000 : 80);

// Log the environment variable to verify it is loaded correctly
console.log('CORS origin:', process.env.PAGE_PORT);

app.use(cors({ origin: process.env.PAGE_PORT }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('', userRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});