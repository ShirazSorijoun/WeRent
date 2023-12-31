import express from 'express';
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';
import adminMiddleware from '../common/admin_middleware';

const router = express.Router();

// Routes for managing users by admin
router.get('/',authMiddleware,adminMiddleware,UserController.getAllUsers);
router.get('/id/:id',authMiddleware,adminMiddleware,UserController.getUserById);
router.get('/:email',authMiddleware,UserController.getUserByEmail);
router.patch('/update',authMiddleware,adminMiddleware,UserController.updateUser);
router.delete('/delete',UserController.deleteUser);



export default router;