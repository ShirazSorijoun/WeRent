import express from 'express';
import UserController from '../controllers/user_controller';
//import AuthMiddleware from '../middlewares/auth_middleware';

const router = express.Router();

// Routes for managing users by admin
router.get('/',UserController.getAllUsers);
router.get('/id/:id', UserController.getUserById);
router.get('/:email', UserController.getUserByEmail);
router.patch('/update', UserController.updateUser);
router.delete('/delete', UserController.deleteUser);


export default router;