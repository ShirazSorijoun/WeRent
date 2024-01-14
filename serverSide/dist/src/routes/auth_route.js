"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
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
*       User:
*           type: object
*           properties:
*               name:
*                   type: string
*                   description: The user name
*               email:
*                   type: string
*                   description: The user email
*               password:
*                   type: string
*                   description: The user password
*               roles:
*                   type: string
*                   description: The user roles (admin, owner, tenant), the default is tenant
*               advertisedApartments:
*                   type: array
*                   description: The apartments that the "owner" user posted
*                   items:
*                       type: object
*               tokens:
*                   type: array
*                   description: The tokens that the user has
*                   items:
*                       type: string
*           required:
*               - name
*               - email
*               - password
*           example:
*               name: Bob
*               email: 'bob@gmail.com'
*               password: '123456'
*               roles: 'tenant'
*               advertisedApartments: []
*               tokens: []
*/
/**
* @swagger
* /auth/register:
*   post:
*       summary: registers a new user
*       tags: [Auth]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: The new user
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           406:
*               description: Exist email
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           400:
*               description: Missing name, email or password or the password is too short
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*
*/
router.post("/register", auth_controller_1.default.register);
/**
* @swagger
* components:
*   schemas:
*       Tokens:
*           type: object
*           required:
*               - accessToken
*               - refreshToken
*           properties:
*               accessToken:
*                   type: string
*                   description: The JWT access token
*               refreshToken:
*                   type: string
*                   description: The JWT refresh token
*           example:
*               accessToken: '123cd123x1xx1'
*               refreshToken: '134r2134cr1x3c'
*/
/**
* @swagger
* /auth/login:
*   post:
*       summary: user login
*       tags: [Auth]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: The acess & refresh tokens
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Tokens'
*/
router.post("/login", auth_controller_1.default.login);
/**
* @swagger
* /auth/logout:
*   get:
*       summary: user logout
*       tags: [Auth]
*       description: need to provide the refresh token in the auth header
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: logout completed successfully
*/
router.get("/logout", auth_controller_1.default.logout);
/**
* @swagger
* /auth/refreshToken:
*   get:
*       summary: get a new access token using the refresh token
*       tags: [Auth]
*       description: need to provide the refresh token in the auth header
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: The acess & refresh tokens
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Tokens'
*           401:
*               description: Forbidden access without token or access with invalid token or access after timeout of token
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Tokens'
*/
router.get("/refresh", auth_controller_1.default.refresh);
exports.default = router;
//# sourceMappingURL=auth_route.js.map