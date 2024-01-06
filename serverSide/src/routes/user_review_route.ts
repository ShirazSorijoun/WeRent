import express from 'express';
import UserReviewController from '../controllers/user_review_controller';

const router = express.Router();

router.get('/', UserReviewController.getAllReview);
router.post('/create', UserReviewController.createReview);

export default router;