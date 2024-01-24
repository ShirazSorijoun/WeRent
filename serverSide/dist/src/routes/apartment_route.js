"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apartment_controller_1 = __importDefault(require("../controllers/apartment_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const owner_middleware_1 = __importDefault(require("../common/owner_middleware"));
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
 *     Features:
 *       type: object
 *       properties:
 *         parking:
 *           type: boolean
 *           description: Indicates whether the apartment has parking
 *         accessForDisabled:
 *           type: boolean
 *           description: Indicates whether the apartment has access for disabled
 *         storage:
 *           type: boolean
 *           description: Indicates whether the apartment has storage
 *         dimension:
 *           type: boolean
 *           description: Indicates whether the apartment has specific dimensions
 *         terrace:
 *           type: boolean
 *           description: Indicates whether the apartment has a terrace
 *         garden:
 *           type: boolean
 *           description: Indicates whether the apartment has a garden
 *         elevators:
 *           type: boolean
 *           description: Indicates whether the building has elevators
 *         airConditioning:
 *           type: boolean
 *           description: Indicates whether the apartment has air conditioning
 *       required:
 *         - parking
 *         - accessForDisabled
 *         - storage
 *         - dimension
 *         - terrace
 *         - garden
 *         - elevators
 *         - airConditioning
 *       example:
 *         parking: true
 *         accessForDisabled: false
 *         storage: true
 *         dimension: false
 *         terrace: true
 *         garden: false
 *         elevators: true
 *         airConditioning: true
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Apartment:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           description: The city where the apartment is located
 *         address:
 *           type: string
 *           description: The address where the apartment is located
 *         type:
 *           type: string
 *           description: The type of the apartment like private apartment
 *         owner:
 *           type: mongoose.Schema.Types.ObjectId
 *           description: The user ID who owns the apartment
 *         floor:
 *           type: number
 *           description: The floor where the apartment is located
 *         rooms:
 *           type: number
 *           description: The number of rooms in the apartment
 *         sizeInSqMeters:
 *           type: number
 *           description: The size of the apartment in meters
 *         price:
 *           type: number
 *           description: The rental price
 *         entryDate:
 *           type: string
 *           format: date
 *           description: Date of entry of tenants to the apartment (YYYY-MM-DD)
 *         furniture:
 *           type: string
 *           description: If the apartment with furniture
 *         features:
 *           $ref: '#/components/schemas/Features'
 *         description:
 *           type: string
 *           description: Additional details that will help market the apartment
 *       required:
 *         - city
 *         - address
 *         - type
 *         - owner
 *         - floor
 *         - rooms
 *         - sizeInSqMeters
 *         - price
 *         - entryDate
 *       example:
 *         city: 'Rishon Lezion'
 *         address: 'Shlomo Levy 14'
 *         type: 'Private Apartment'
 *         floor: 5
 *         rooms: 3
 *         sizeInSqMeters: 85
 *         price: 3000
 *         entryDate: '2024-09-17' #YYYY-MM-DD
 *         furniture: 'full'
 *         description: 'Great Apartment'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ApartmentUpdate:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           description: The updated city where the apartment is located
 *         address:
 *           type: string
 *           description: The updated address where the apartment is located
 *         type:
 *           type: string
 *           description: The type of the apartment like private apartment
 *         floor:
 *           type: number
 *           description: The updated floor where the apartment is located
 *         rooms:
 *           type: number
 *           description: The updated number of rooms in the apartment
 *         sizeInSqMeters:
 *           type: number
 *           description: The updated size of the apartment in meters
 *         price:
 *           type: number
 *           description: The rental price
 *         entryDate:
 *           type: string
 *           format: date
 *           description: The updated date of entry of tenants to the apartment (YYYY-MM-DD)
 *         apartment_image:
 *           type: string
 *           description: image of the apartment
 *         furniture:
 *           type: string
 *           description: If the apartment with furniture
 *         features:
 *           $ref: '#/components/schemas/Features'
 *         description:
 *           type: string
 *           description: Additional details that will help market the apartment
 *       required:
 *         - city
 *         - address
 *         - type
 *         - floor
 *         - rooms
 *         - sizeInSqMeters
 *         - price
 *         - entryDate
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *       required:
 *         - message
 */
/**
 * @swagger
 * /apartment:
 *   get:
 *       summary: Get all apartments
 *       tags: [Apartment]
 *       responses:
 *           200:
 *               description: Successfully retrieved apartments
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: array
 *                           items:
 *                               $ref: '#/components/schemas/Apartment'
 *           500:
 *               description: Internal Server Error
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *
 */
router.get("/", apartment_controller_1.default.getAllApartments);
/**
 * @swagger
 * /apartment/{id}:
 *   get:
 *       summary: Get apartment by ID
 *       tags: [Apartment]
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: string
 *             required: true
 *             description: Apartment ID
 *       responses:
 *           200:
 *               description: Successfully retrieved the apartment
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Apartment'
 *           404:
 *               description: Apartment not found
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *           500:
 *               description: Internal Server Error
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 */
router.get("/:id", apartment_controller_1.default.getApartmentById);
/**
 * @swagger
 * components:
 *   schemas:
 *     ApartmentCreateRequest:
 *       type: object
 *       properties:
 *         apartment:
 *           $ref: '#/components/schemas/Apartment'
 *       required:
 *         - apartment
 */
/**
 * @swagger
 * /apartment/create:
 *   post:
 *     summary: Create a new apartment
 *     tags: [Apartment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApartmentCreateRequest'
 *     responses:
 *       201:
 *         description: Apartment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       400:
 *         description: Bad Request - Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/create", auth_middleware_1.default, owner_middleware_1.default, apartment_controller_1.default.createApartment);
/**
 * @swagger
 * /apartment/update:
 *   patch:
 *     summary: Update an apartment
 *     tags: [Apartment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the apartment to be updated
 *               apartment:
 *                 $ref: '#/components/schemas/ApartmentUpdate'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated the apartment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       400:
 *         description: Bad Request - Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not Found - Apartment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/update", auth_middleware_1.default, apartment_controller_1.default.updateApartment);
/**
 * @swagger
 * /apartment/delete/{id}:
 *   delete:
 *       summary: Delete an apartment
 *       tags: [Apartment]
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: string
 *             required: true
 *             description: Apartment ID
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           200:
 *               description: Successfully deleted the apartment
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               message:
 *                                   type: string
 *                                   description: Success message
 *           403:
 *               description: Forbidden - Access denied
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *           404:
 *               description: Not Found - Apartment not found
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *           500:
 *               description: Internal Server Error
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 */
router.delete("/delete/:id", auth_middleware_1.default, apartment_controller_1.default.deleteApartment);
exports.default = router;
//# sourceMappingURL=apartment_route.js.map