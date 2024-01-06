import express from 'express';
import ApartmentController from '../controllers/apartment_controller';
import AuthMiddleware from '../common/auth_middleware';
import ownerMiddleware from '../common/owner_middleware';
import adminMiddleware from '../common/admin_middleware';
import verifyUserOwnership  from '../common/verify_user_ownership';

const router = express.Router();


router.get('/', ApartmentController.getAllApartments);
router.get('/:id', ApartmentController.getApartmentById);


// Allow admin to edit and delete any apartment
router.patch('/admin/update', AuthMiddleware,adminMiddleware, ApartmentController.updateApartment);
router.delete('/admin/delete/:id', AuthMiddleware, adminMiddleware,ApartmentController.deleteApartment);


//Allow owner to create, edit, and delete their own apartments
router.post('/create', AuthMiddleware,ownerMiddleware, ApartmentController.createApartment);
router.patch('/update', AuthMiddleware,verifyUserOwnership, ApartmentController.updateApartment);

router.delete('/delete/:id', AuthMiddleware, ApartmentController.deleteApartment);


export default router;

