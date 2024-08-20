import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js'
import jwt from 'jsonwebtoken'

import { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser } from './controllers/user.js'

const app = express()
app.use(express.json())

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)

  if (conn) {
    console.log('MongoDB connected')
  }
  else {
    console.log('MongoDB connection failed')
  }
}
connectDB()
//middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
}

const checkUserType = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (user.type === 'admin') {
      next();
    } else {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

}



//API
app.post('/createuser', createUser)
app.get('/getusers', auth, getUsers)
app.get('/getuser/:id', auth, getUserById)
app.put('/updateuser/:id', auth, checkUserType, updateUser)
app.delete('/deleteuser/:id', auth, checkUserType, deleteUser)
app.post('/login', loginUser)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});