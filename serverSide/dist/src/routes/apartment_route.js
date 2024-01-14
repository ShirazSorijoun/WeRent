"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apartment_controller_1 = __importDefault(require("../controllers/apartment_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const owner_middleware_1 = __importDefault(require("../common/owner_middleware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const verify_user_ownership_1 = __importDefault(require("../common/verify_user_ownership"));
const router = express_1.default.Router();
/**
* @swagger
* tags:
*   name: Apartment
*   description: The apartment API
*/
/**
* @swagger
* components:
*   securitySchemes:
*       bearerAuth:
*           type: http
*           scheme: bearer
*           bearerFormat: JWT
*/
/**
* @swagger
* components:
*   schemas:
*       Apartment:
*           type: object
*           properties:
*               city:
*                   type: string
*                   description: The city where the apartment is located
*               address:
*                   type: string
*                   description: The address where the apartment is located
*               owner:
*                   type: mongoose.Schema.Types.ObjectId
*                   description: The user ID who owns the apartment
*               floor:
*                   type: Number
*                   description: The floor where the apartment is located
*               rooms:
*                   type: Number
*                   description: The number of rooms in the apartment
*               sizeInSqMeters:
*                   type: Number
*                   description: The size of the apartment in meters
*               entryDate:
*                   type: Date
*                   description: Date of entry of tenants to the apartment
*           required:
*               - city
*               - address
*               - owner
*               - floor
*               - rooms
*               - sizeInSqMeters
*               - entryDate
*           example:
*               city: 'Rishon Lezion'
*               address: 'Shlomo Levy 14'
*               owner: '5f9f0c6c1c9d440000b1d5d0'
*               floor: 5
*               rooms: 3
*               sizeInSqMeters: 85
*               entryDate: '17/09/2024'
*/
/**
* @swagger
* /apartment/:
*   get:
*       summary: get all apartment
*       tags: [Apartment]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Apartment'
*       responses:
*           200:
*               description: Get all apartment
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           500:
*               description: Error fetching apartments
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*
*/
router.get('/', apartment_controller_1.default.getAllApartments);
/**
* @swagger
* /apartment/:id:
*   get:
*       summary: get apartment by ID
*       tags: [Apartment]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Apartment'
*       responses:
*           200:
*               description: Get apartment
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           400:
*               description: apartment ID is required for deletion
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*
*/
router.get('/:id', apartment_controller_1.default.getApartmentById);
// Allow admin to edit and delete any apartment
/**
* @swagger
* /apartment/admin/update:
*   patch:
*       summary: update apartment (admin only)
*       tags: [Apartment]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Apartment'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Apartment update successful
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           403:
*               description: Access denied
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           400:
*               description: At least one field is required for updating
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*
*/
router.patch('/admin/update', auth_middleware_1.default, admin_middleware_1.default, apartment_controller_1.default.updateApartment);
/**
* @swagger
* /apartment/admin/delete/:id:
*   delete:
*       summary: delete apartment (admin only)
*       tags: [Apartment]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Apartment'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Apartment delete successful
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           403:
*               description: Access denied
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           500:
*               description: Internal Server Error
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           404:
*               description: Apartment not found
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*
*/
router.delete('/admin/delete/:id', auth_middleware_1.default, admin_middleware_1.default, apartment_controller_1.default.deleteApartment);
//Allow owner to create, edit, and delete their own apartments
/**
* @swagger
* /apartment/create:
*   post:
*       summary: create a new apartment (owner only)
*       tags: [Apartment]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Apartment'
*       security:
*           - bearerAuth: []
*       responses:
*           201:
*               description: Apartment create successful
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           400:
*               description: Server error request
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*
*/
router.post('/create', auth_middleware_1.default, owner_middleware_1.default, apartment_controller_1.default.createApartment);
/**
* @swagger
* /apartment/update:
*   patch:
*       summary: update apartment (owner only)
*       tags: [Apartment]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Apartment'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Apartment update successful
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           400:
*               description: Apartment ID is required
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           403:
*               description: Access denied
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*
*/
router.patch('/update', auth_middleware_1.default, verify_user_ownership_1.default, apartment_controller_1.default.updateApartment);
/**
* @swagger
* /apartment/delete/:id:
*   delete:
*       summary: delete apartment (owner only)
*       tags: [Apartment]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Apartment'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Apartment update successful
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           403:
*               description: Access denied
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           404:
*               description: Partment not found
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*           500:
*               description: Internal Server Error
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Apartment'
*
*/
router.delete('/delete/:id', auth_middleware_1.default, apartment_controller_1.default.deleteApartment);
exports.default = router;
//# sourceMappingURL=apartment_route.js.map