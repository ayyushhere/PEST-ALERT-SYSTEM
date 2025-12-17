import express from 'express';
import { registerUser, loginUser, getMe, getDashboardStats, getUsers, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;