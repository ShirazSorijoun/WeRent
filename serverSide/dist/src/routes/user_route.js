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
router.get('/', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getAllUsers);
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
router.delete('/delete/:id', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.deleteUser);
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
router.get('/:email', auth_middleware_1.default, user_controller_1.default.getUserByEmail);
exports.default = router;
//# sourceMappingURL=user_route.js.map