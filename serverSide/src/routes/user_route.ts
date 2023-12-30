import express from 'express';
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';

const router = express.Router();

// Routes for managing users by admin
router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/id/:id', authMiddleware, UserController.getUserById);
router.get('/:email', authMiddleware, UserController.getUserByEmail);
router.patch('/update', authMiddleware, UserController.updateUser);
router.delete('/delete', authMiddleware, UserController.deleteUser);


export default router;