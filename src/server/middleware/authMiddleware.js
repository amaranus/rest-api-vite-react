// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({
      _id: decoded._id,
      // 'tokens.token': token,
    })

    if (!user || !token) {
      throw new Error()
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ message: process.env.MSG_NOT_ALLOWED })
  }
}

export default authMiddleware
