import express from 'express';
import bcrypt from 'bcrypt';
import '../db/connection.js'
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken"

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  const user = req.body;

  try {
    const existingUser = await userModel.findOne({ email: user.email });
    if (existingUser) {
      return res.status(409).json({ message: 'The user already exists in the system.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };

    await userModel.create(newUser);
    res.status(201).json({ message: 'User saved successfully' });

  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Failed to save user', error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const credentials = req.body

  try {
    const user = await userModel.findOne({ email: credentials.email })

    if (!user) 
      return  res.status(403).json({ message: 'Failed to get user', error: error.message });

    const similar = await bcrypt.compare(credentials.password, user.password)

    if (!similar) 
      return res.status(403).json({ message: 'Failed to get user', error: error.message });

    assignToken(user.toJSON(), res)

    res.status(201).json({ message: 'User is logged in...' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
})


function assignToken(user, res) {
  delete user.password

  const token = jwt.sign(user, process.env.PRIVATE_ACCESS_KEY)
  console.log('Token generated:', token);

  res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Only use secure in production
      sameSite: 'lax' 
  })
  console.log('Cookie set:', res.getHeaders()['set-cookie']);
}

userRouter.get("/isLoggedIn", (req,res) => {
  console.log('Cookies received:', req.cookies);
  const token = req.cookies?.token;
  
  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ message: 'No token provided', isLoggedIn: false });
  }

  console.log('Token found:', token);

  jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (error, user) => {
    if (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: 'Failed to authenticate token', isLoggedIn: false });
    } else {
      console.log("User verified:", user);
      return res.status(200).json({ message: 'The user is connected', isLoggedIn: true });
    }
  });
})


export default userRouter;