"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apartment_controller_1 = __importDefault(require("../controllers/apartment_controller"));
//import AuthMiddleware from '../middlewares/auth_middleware';
const router = express_1.default.Router();
// Routes for managing apartments
router.get('/', apartment_controller_1.default.getAllApartments);
router.get('/:id', apartment_controller_1.default.getApartmentById);
// Allow admin to edit and delete any apartment
//router.patch('/update', AuthMiddleware.requireAdmin, ApartmentController.updateApartment);
//router.delete('/delete', AuthMiddleware.requireAdmin, ApartmentController.deleteApartment);
// Allow owner to create, edit, and delete their own apartments
//router.post('/create', AuthMiddleware.requireOwner, ApartmentController.createApartment);
//router.patch('/update', AuthMiddleware.requireOwner, ApartmentController.updateApartment);
//router.delete('/delete', AuthMiddleware.requireOwner, ApartmentController.deleteApartment);
exports.default = router;
//# sourceMappingURL=apartment_route.js.map