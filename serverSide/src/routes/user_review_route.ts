import express from 'express';
import UserReviewController from '../controllers/user_review_controller';
import authMiddleware from '../common/auth_middleware';

const router = express.Router();



/**
* @swagger
* tags:
*   name: UserReview
*   description: The user review API
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
*       UserReview:
*           type: object
*           properties:
*               userId:
*                   type: Schema.Types.ObjectId
*                   description: ID of the user who created the review
*               ownerName:
*                   type: string
*                   description: The user name
*               description:
*                   type: string
*                   description: The review description
*           required:
*               - userId
*               - ownerName
*               - description
*           example:
*               userId: 5f9f0c6c1c9d440000b1d5d0
*               ownerName: Bob
*               description: 'This is a review'
*/


/**
* @swagger
* /userReview/:
*   get:
*       summary: get all reviews recorded on the site
*       tags: [UserReview]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/UserReview'
*       responses:
*           200:
*               description: All reviews
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/UserReview'
*
*/
router.get('/', UserReviewController.getAllReview);



/**
* @swagger
* /userReview/create:
*   post:
*       summary: create a new user review
*       tags: [UserReview]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/UserReview'
*       security:
*           - bearerAuth: []
*       responses:
*           201:
*               description: The review was successfully created
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/UserReview'
*
*/
router.post('/create', authMiddleware, UserReviewController.createReview);



/**
* @swagger
* /userReview/admin/:id:
*   delete:
*       summary: delete a user review by admin (admin only)
*       tags: [UserReview]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/UserReview'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: The review was successfully deleted
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/UserReview'
*
*/
router.delete('/admin/:id', authMiddleware, UserReviewController.adminDeleteReview);



/**
* @swagger
* /userReview/:id:
*   delete:
*       summary: delete a user review by the owner of the review (owner only)
*       tags: [UserReview]
*       requestBody:
*           required: false
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/UserReview'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: The review was successfully deleted
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/UserReview'
*           403:
*               description: Only owner can delete reviews
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/UserReview'
*
*/
router.delete('/:id', authMiddleware, UserReviewController.deleteReview);

export default router;