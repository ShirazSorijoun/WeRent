import express from 'express';
import ApartmentController from '../controllers/apartment_controller';
import AuthMiddleware from '../common/auth_middleware';
import ownerMiddleware from '../common/owner_middleware';

const router = express.Router();


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
*             apartment:
*               city: 'Rishon Lezion'
*               address: 'Shlomo Levy 14'
*               owner: '5f9f0c6c1c9d440000b1d5d0'
*               floor: 5
*               rooms: 3
*               sizeInSqMeters: 85
*               entryDate: '2024-09-17' #YYYY-MM-DD
*       Error:
*           type: object
*           properties:
*               message:
*                   type: string
*                   description: Error message
*           required:
*               - message
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
 *         floor:
 *           type: number
 *           description: The updated floor where the apartment is located
 *         rooms:
 *           type: number
 *           description: The updated number of rooms in the apartment
 *         sizeInSqMeters:
 *           type: number
 *           description: The updated size of the apartment in meters
 *         entryDate:
 *           type: string
 *           format: date
 *           description: The updated date of entry of tenants to the apartment (YYYY-MM-DD)
 *       required:
 *         - city
 *         - address
 *         - floor
 *         - rooms
 *         - sizeInSqMeters
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

router.get('/', ApartmentController.getAllApartments);



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

router.get('/:id', ApartmentController.getApartmentById);



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
router.post('/create', AuthMiddleware,ownerMiddleware, ApartmentController.createApartment);



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

router.patch('/update', AuthMiddleware, ApartmentController.updateApartment);



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

router.delete('/delete/:id', AuthMiddleware, ApartmentController.deleteApartment);


export default router;

