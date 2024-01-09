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



// Routes for managing users by admin


/**
* @swagger
* /user/:
*   get:
*       summary: get all users registered to the site (admin only)
*       tags: [User]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Get all users registered to the site
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           401:
*               description: Unauthorized
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.get('/',authMiddleware,adminMiddleware,UserController.getAllUsers);



/**
* @swagger
* /user/id/:id:
*   get:
*       summary: get user by id (admin only)
*       tags: [User]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Get user by id
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           500:
*               description: Error fetching user
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.get('/id/:id',authMiddleware,adminMiddleware,UserController.getUserById);



/**
* @swagger
* /user/update:
*   patch:
*       summary: Update user by id (admin only)
*       tags: [User]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Get user by id
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           404:
*               description: User not found
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           500:
*               description: Internal server error
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.patch('/update',authMiddleware,adminMiddleware,UserController.updateUser);



/**
* @swagger
* /user/delete/:id:
*   delete:
*       summary: delete user by id (admin only)
*       tags: [User]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: User deleted successfully
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           404:
*               description: User not found
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           400:
*               description: User ID is required for deletion
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           500:
*               description: Internal server error
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.delete('/delete/:id',authMiddleware,adminMiddleware,UserController.deleteUser);



// Routes for managing users by owner



/**
* @swagger
* /user/apartments:
*   get:
*       summary: get the apartments that the logged in user posted (owner only)
*       tags: [User]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Get all apartments posted by the user
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           404:
*               description: User not found
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           500:
*               description: Internal server error
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.get('/apartments',authMiddleware,ownerMiddleware,UserController.getMyApartments);



/**
* @swagger
* /user/updateOwnProfile:
*   patch:
*       summary: user profile update (owner only)
*       tags: [User]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Updated profile
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           404:
*               description: User not found
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           400:
*               description: At least one field (name, email, or password) is required for updating or user ID is required for updating the profile
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           500:
*               description: Internal server error
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.patch('/updateOwnProfile', authMiddleware, verifyUserOwnership,UserController.updateOwnProfile);



/**
* @swagger
* /user/:email/:
*   get:
*       summary: get user by email
*       tags: [User]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: Get user by email
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           400:
*               description: Invalid email
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.get('/:email',authMiddleware,UserController.getUserByEmail);

export default router;