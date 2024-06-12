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
 *               - description
 *           example:
 *               review:
 *                   description: 'This is a review'
 */

/**
 * @swagger
 * /userReview:
 *   get:
 *       summary: Get all user reviews
 *       tags: [UserReview]
 *       responses:
 *           200:
 *               description: Successfully retrieved reviews
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: array
 *                           items:
 *                               $ref: '#/components/schemas/UserReview'
 *           500:
 *               description: Internal Server Error
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
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
 * /userReview/admin/{id}:
 *   delete:
 *       summary: Admin delete a user review
 *       tags: [UserReview]
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: string
 *             required: true
 *             description: UserReview ID
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
 *               description: Only admins can delete reviews
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'  # Define an error schema
 *           404:
 *               description: Review not found
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
 *
 */

router.delete(
  '/admin/:id',
  authMiddleware,
  UserReviewController.adminDeleteReview,
);

/**
 * @swagger
 * /userReview/{id}:
 *   delete:
 *       summary: Delete a user review by the owner of the review (owner only)
 *       tags: [UserReview]
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: string
 *             required: true
 *             description: UserReview ID
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
 *               description: Only the owner can delete reviews
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'  # Define an error schema
 *
 */
router.delete('/:id', authMiddleware, UserReviewController.deleteReview);

export default router;
