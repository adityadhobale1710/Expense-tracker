import express from 'express';
import { getMe, updateMe, changePassword, deleteMe, seedUserMockData } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/password', changePassword);
router.delete('/me', deleteMe);
router.post('/seed', seedUserMockData);

export default router;
