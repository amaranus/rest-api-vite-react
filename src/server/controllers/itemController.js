// controllers/itemController.js

import { Item } from '../models/Item.js'

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()

    if (items.length === 0) return res.status(400).send({ message: process.env.MSG_ITEM_NOT_FOUND })

    res.send(items)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    res.send(item)
  } catch (error) {
    return res.status(404).send({ message: process.env.MSG_ITEM_NOT_FOUND })
  }
}

export const createItem = async (req, res) => {
  try {
    const item = await Item.findOne({ name: req.body.name })

    if (item) {
      res.status(400).send({ message: process.env.MSG_ITEM_ALREADY_EXISTS })
      return
    }

    const newItem = new Item(req.body)

    await newItem.save()
    res.status(201).json({ message: process.env.MSG_ITEM_CREATED, newItem })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const updateItem = async (req, res) => {
  const updates = Object.keys(req.body)

  const allowedUpdates = ['name', 'description', 'price']

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ message: process.env.MSG_INVALID_UPDATE })
  }

  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).send({ message: process.env.MSG_ITEM_NOT_FOUND })
    }

    updates.forEach((update) => (item[update] = req.body[update]))

    await item.save()
    res.status(201).json({ message: process.env.MSG_ITEM_UPDATED, item })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id)

    if (!item) {
      return res.status(404).send({ message: process.env.MSG_ITEM_NOT_FOUND })
    }

    res.send(item)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const itemSearch = async (req, res) => {
  try {
    const items = await Item.find({
      $or: [{ name: { $regex: req.query.q, $options: 'i' } }, { description: { $regex: req.query.q, $options: 'i' } }],
    })
    res.status(201).json(items)
  } catch (error) {
    res.status(500).send(error)
  }
}