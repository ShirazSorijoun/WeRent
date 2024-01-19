"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const owner_middleware_1 = __importDefault(require("../common/owner_middleware"));
const verify_user_ownership_1 = __importDefault(require("../common/verify_user_ownership"));
const router = express_1.default.Router();
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
router.get('/', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getAllUsers);
/**
* @swagger
* /user/id/:id:
*   get:
*       summary: get user by id (admin only)
*       tags: [User]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*             required: true
*             description: User ID
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
router.get('/id/:id', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getUserById);
/**
* @swagger
* /user/update:
*   patch:
*       summary: Update user by id (admin only)
*       tags: [User]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*             required: true
*             description: User ID
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
router.patch('/update', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.updateUser);
/**
* @swagger
* /user/delete/:id:
*   delete:
*       summary: delete user by id (admin only)
*       tags: [User]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*             required: true
*             description: User ID
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
router.delete('/delete/:id', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.deleteUser);
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
router.get('/apartments', auth_middleware_1.default, owner_middleware_1.default, user_controller_1.default.getMyApartments);
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
router.patch('/updateOwnProfile', auth_middleware_1.default, verify_user_ownership_1.default, user_controller_1.default.updateOwnProfile);
/**
* @swagger
* /user/:email/:
*   get:
*       summary: get user by email
*       tags: [User]
*       parameters:
*           - in: path
*             name: email
*             schema:
*               type: string
*             required: true
*             description: User's email
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
router.get('/:email', auth_middleware_1.default, user_controller_1.default.getUserByEmail);
exports.default = router;
//# sourceMappingURL=user_route.js.map