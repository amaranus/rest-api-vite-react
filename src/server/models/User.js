// models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  secretQuestion: { type: String, required: true },
  secretAnswer: { type: String, required: true },
  // tokens: [
  //   {
  //     token: { type: String, required: true },
  //   },
  // ], // tokens dizisi ve token alanı
})

export default mongoose.model('User', userSchema)
