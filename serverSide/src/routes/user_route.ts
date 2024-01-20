import express from 'express';
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';
import adminMiddleware from '../common/admin_middleware';
import ownerMiddleware from '../common/owner_middleware';
import verifyUserOwnership  from '../common/verify_user_ownership';

const router = express.Router();


/**
* @swagger
* tags:
*   name: User
*   description: The user API
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
 * /user/:
 *   get:
 *     summary: Get all users (Admin Only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
router.get('/',authMiddleware,adminMiddleware,UserController.getAllUsers);



/**
 * @swagger
 * /user/id/{id}:
 *   get:
 *     summary: Get a user by ID (Admin Only)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not Found - User not found
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
router.get('/id/:id',authMiddleware,adminMiddleware,UserController.getUserById);



/**
 * @swagger
 * /user/update:
 *   patch:
 *     summary: Update a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the user to be updated
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The updated name of the user
 *                   email:
 *                     type: string
 *                     description: The updated email of the user
 *                   password:
 *                     type: string
 *                     description: The updated password of the user
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Successfully updated the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - At least one field (name, email, or password) is required for update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not Found - User not found
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
router.patch('/update',authMiddleware,adminMiddleware,UserController.updateUser);



/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Deletion success message
 *       400:
 *         description: Bad Request - User ID is required for deletion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not Found - User not found
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
router.delete('/delete/:id',authMiddleware,adminMiddleware,UserController.deleteUser);



// Routes for managing users by owner



/**
 * @swagger
 * /user/apartments:
 *   get:
 *     summary: Get apartments advertised by the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's advertised apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 myApartments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Apartment'
 *       404:
 *         description: Not Found - User not found
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

router.get('/apartments',authMiddleware,ownerMiddleware,UserController.getMyApartments);



/**
 * @swagger
 * /user/updateOwnProfile:
 *   patch:
 *     summary: Update own user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the user to be updated
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The updated name of the user
 *                   email:
 *                     type: string
 *                     description: The updated email of the user
 *                   password:
 *                     type: string
 *                     description: The updated password of the user
 *                   profile_image:
 *                     type: string
 *                     description: The Profile image
 *             required:
 *               - id
 *               - user
 *           example:
 *             id: '65aa74fa3abd5e0482be3def'
 *             user:
 *               name: 'Updated Name'
 *               email: 'updated.email@example.com'
 *               password: '8888888'
 *               profile_image: 'https://www.freeiconspng.com/uploads/no-image-icon-4.png'
 *     responses:
 *       200:
 *         description: Successfully updated own user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - At least one field (name, email, or password) is required for update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not Found - User not found
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
router.patch('/updateOwnProfile', authMiddleware,verifyUserOwnership,UserController.updateOwnProfile);



/**
 * @swagger
 * /user/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User email
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the user by email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:email',authMiddleware,UserController.getUserByEmail);

export default router;
