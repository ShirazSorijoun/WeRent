import express from 'express';
import UserReviewController from '../controllers/user_review_controller';
import authMiddleware from '../common/auth_middleware';


const router = express.Router();

router.get('/', authMiddleware, UserReviewController.getAllReview);
router.post('/create', authMiddleware, UserReviewController.createReview);
router.delete('/:id', authMiddleware, UserReviewController.adminDeleteReview);

export default router;