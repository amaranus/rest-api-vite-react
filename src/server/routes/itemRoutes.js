// routes/itemRoutes.js

import express from 'express'
const router = express.Router()
import { getAllItems, getItemById, createItem, updateItem, deleteItem, itemSearch } from '../controllers/itemController.js'
import authMiddleware from '../middleware/authMiddleware.js'

// Middleware to authenticate requests
// router.use(authMiddleware);

// Item Routes
router.get('/', getAllItems)
router.post('/', authMiddleware, createItem)
router.get('/search', itemSearch)
router.get('/:id', getItemById)
router.put('/:id', authMiddleware, updateItem)
router.delete('/:id', authMiddleware, deleteItem)

export default router
