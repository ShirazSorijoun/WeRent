import { Request, Response } from 'express';
import UserReview from '../models/user_review_model';

interface AuthRequest extends Request {
  locals: {
    currentUserId?: string;
  };
}

const getAllReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await UserReview.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching reviews' });
  }
};


const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { review } = req.body;
    // Set the owner based on the current user
    review.owner = req.locals.currentUserId;
    const createdReview = await UserReview.create(review);
    res.status(201).json(createdReview);
  } catch (err) {
    res.status(400).send('Something went wrong -> createdReview');
  }
};



export default {
  getAllReview,
  createReview
};


