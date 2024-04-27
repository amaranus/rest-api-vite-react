import express from 'express'
const router = express.Router()
import { getSecretQuestion, login, logout, remindCredentials, verifyToken } from '../controllers/authController.js'

router.post('/login', login)
router.post('/logout', logout)
router.post('/verify', verifyToken)
router.post('/pwdreset', remindCredentials)
router.get('/getsecretquestion', getSecretQuestion)

export default router
