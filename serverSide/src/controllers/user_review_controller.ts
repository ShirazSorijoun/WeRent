import { Request, Response } from 'express';
import UserReview, { IUserReview } from '../models/user_review_model';
import { User } from '../models/user_model';
import { AuthRequest } from '../models/request';

const getAllReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await UserReview.find().populate({
      path: 'user',
      select: 'profile_image firstName lastName ',
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching reviews' });
  }
};

const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewText } = req.body;
    const user = req.locals.currentUserId;

    const createdReview: IUserReview = await UserReview.create({
      user,
      description: reviewText,
    });

    res.status(201).json(
      createdReview.populate({
        path: 'user',
        select: 'profile_image firstName lastName ',
      }),
    );
  } catch (err) {
    res.status(400).send('Something went wrong -> createdReview');
  }
};

const adminDeleteReview = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const reviewId = req.params.id;

    const review = await UserReview.findById(reviewId);
    if (!review) {
      res.status(404).send('Review not found');
      return;
    }

    const user = await User.findById(req.locals.currentUserId);
    if (!user.isAdmin) {
      res.status(403).send('Only admins can delete reviews');
      return;
    }

    await UserReview.findByIdAndDelete(reviewId);
    res.status(200).send('Review deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviewId = req.params.id;

    const review = await UserReview.findById(reviewId);
    if (!review) {
      res.status(404).send('Review not found');
      return;
    }

    const user = await User.findById(req.locals.currentUserId);

    const ownerOfReview = review.user.toString();
    const userId = user._id.toString();

    if (userId !== ownerOfReview) {
      res.status(403).send('Only owner can delete reviews');
      return;
    }

    await UserReview.findByIdAndDelete(reviewId);
    res.status(200).send('Review deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export default {
  getAllReview,
  createReview,
  adminDeleteReview,
  deleteReview,
};
