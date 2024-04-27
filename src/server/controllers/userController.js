// controllers/userController.js

import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export const createUser = async (req, res) => {
  try {
    const { username, password, secretQuestion, secretAnswer } = req.body

    if (password.length < 6) {
      return res.status(400).json({ message: process.env.MSG_PASSWORD_CHARACTERS })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const newUser = new User({
      username,
      password: passwordHash,
      secretQuestion,
      secretAnswer,
    })
    const user = await User.findOne({ username: req.body.username })

    if (user) {
      res.status(400).send({ message: process.env.MSG_USER_ALREADY_EXISTS })
      return
    }

    await newUser.save()
    res.status(201).send(newUser)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    res.send(user)
  } catch (error) {
    return res.status(404).send({ message: process.env.MSG_USER_NOT_FOUND })
  }
}

export const updateUser = async (req, res) => {
  const updates = Object.keys(req.body)

  const allowedUpdates = ['username', 'password', 'secretQuestion', 'secretAnswer']

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ message: process.env.MSG_INVALID_UPDATE })
  }

  try {
    const user = await User.findById(req.params.id)
    const password = req.body.password

    if (!user) {
      return res.status(404).send({ message: process.env.MSG_USER_NOT_FOUND })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: process.env.MSG_PASSWORD_CHARACTERS })
    }

    updates.forEach((update) => {
      if (update === 'password') {
        user[update] = bcrypt.hashSync(req.body[update], 12)
      } else {
        user[update] = req.body[update]
      }
    })

    await user.save()

    res.status(201).json({ message: process.env.MSG_USER_UPDATED, user })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).send({ message: process.env.MSG_USER_NOT_FOUND })
    }

    res.send(user)
  } catch (error) {
    res.status(500).send(error)
  }
}
