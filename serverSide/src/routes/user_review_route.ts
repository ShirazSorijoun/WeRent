import express from 'express';
import UserReviewController from '../controllers/user_review_controller';
import authMiddleware from '../common/auth_middleware';



const router = express.Router();

router.get('/', UserReviewController.getAllReview);
router.post('/create', authMiddleware, UserReviewController.createReview);
router.delete('/admin/:id', authMiddleware, UserReviewController.adminDeleteReview);
router.delete('/:id', authMiddleware, UserReviewController.deleteReview);

export default router;