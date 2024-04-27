// controllers/authController.js

import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body


    const user = await User.findOne({ username })


    if (!user) {
      return res.status(400).json({ message: process.env.MSG_USER_NOT_FOUND })
    }

    //   res.status(400).send({ message: process.env.MSG_USER_ALREADY_LOGGED_IN })
    //   return
    // }


    const comparePassword = await bcrypt.compare(password, user.password)

    if (!comparePassword) {
      return res.status(400).json({ message: process.env.MSG_INVALID_CREDENTIALS })
    }


    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    console.log(token, 'authcontroller')

    // Token'i kullanıcıya kaydet (tokens dizisine ekle)
    // user.tokens = []
    // user.tokens.push({ token })
    // await user.save()

    res.send({ user, token })
  } catch (error) {
    res.status(400).send({ message: process.env.MSG_INVALID_CREDENTIALS })
  }
}


export const logout = async (req, res) => {
  try {

    // const user = req.user


    // user.tokens = []


    // await user.save()

    res.send({ message: process.env.MSG_LOGGED_OUT_SUCCESS })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

// Kullanıcı adı ve parolasını hatırlatma işlemi
export const remindCredentials = async (req, res) => {
  try {
    const { username, secretAnswer } = req.body


    const user = await User.findOne({ username, secretAnswer })

    if (!user) {
      return res
        .status(404)
        .send({ message: 'Kullanıcı bulunamadı veya gizli soru/cevap eşleşmedi' })
    }


    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    // Token'i kullanıcıya kaydet (tokens dizisine ekle) Not: Veritabanına kaydedilmeyi kaldırdım, oturum açtıktan sonra kayıt edilecek.
    // user.tokens = []
    // user.tokens.push({ token })
    // await user.save()

    res.send({ user, token })
  } catch (error) {
    res.status(500).send(error)
  }
}

export const verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id })
    if (!user) {
      throw new Error()
    }
    res.send({ user, token })
  } catch (error) {
    res.status(401).send({ message: process.env.MSG_NOT_ALLOWED })
  }
}

export const getSecretQuestion = async (req, res) => {
  const { username } = req.query
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: process.env.MSG_USER_NOT_FOUND })
    }
    res.send(user)
  } catch (error) {
    console.error('Hata:', error)
    res.status(500).json({ message: error })
  }
}
