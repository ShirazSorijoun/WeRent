import express from 'express';
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';
import adminMiddleware from '../common/admin_middleware';
import ownerMiddleware from '../common/owner_middleware';
import verifyUserOwnership  from '../common/verify_user_ownership';

const router = express.Router();

// Routes for managing users by admin
router.get('/',authMiddleware,adminMiddleware,UserController.getAllUsers);
router.get('/id/:id',authMiddleware,adminMiddleware,UserController.getUserById);
router.patch('/update',authMiddleware,adminMiddleware,UserController.updateUser);
router.delete('/delete/:id',authMiddleware,adminMiddleware,UserController.deleteUser);

// Routes for managing users by owner
router.get('/apartments',authMiddleware,ownerMiddleware,UserController.getMyApartments);

// Routes for managing users by owner

router.patch('/updateOwnProfile', authMiddleware, verifyUserOwnership,UserController.updateOwnProfile);
router.get('/:email',authMiddleware,UserController.getUserByEmail);

export default router;