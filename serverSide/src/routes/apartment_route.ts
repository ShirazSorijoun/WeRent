import express from 'express';
import ApartmentController from '../controllers/apartment_controller';
//import AuthMiddleware from '../middlewares/auth_middleware';

const router = express.Router();

// Routes for managing apartments
router.get('/', ApartmentController.getAllApartments);
router.get('/:id', ApartmentController.getApartmentById);

// Allow admin to edit and delete any apartment
//router.patch('/update', AuthMiddleware.requireAdmin, ApartmentController.updateApartment);
//router.delete('/delete', AuthMiddleware.requireAdmin, ApartmentController.deleteApartment);

// Allow owner to create, edit, and delete their own apartments
//router.post('/create', AuthMiddleware.requireOwner, ApartmentController.createApartment);
//router.patch('/update', AuthMiddleware.requireOwner, ApartmentController.updateApartment);
//router.delete('/delete', AuthMiddleware.requireOwner, ApartmentController.deleteApartment);


export default router;

