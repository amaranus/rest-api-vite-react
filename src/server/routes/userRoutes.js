// routes/userRoutes.js
import express from 'express'
const router = express.Router()
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

router.post('/', createUser)
router.get('/', authMiddleware, getAllUsers)
router.get('/:id', authMiddleware, getUserById)
router.put('/:id', updateUser)
router.delete('/:id', authMiddleware, deleteUser)
export default router
