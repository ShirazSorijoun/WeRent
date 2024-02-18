import { Request, Response } from 'express';
import UserReview, { IUserReview } from '../models/user_review_model';
import User from '../models/user_model';


interface AuthRequest extends Request {
  locals: {
    currentUserId?: string;
  };
}

/*
const contactUser = async (currentUserId: string, message: string): Promise<void> => {
  // Retrieve the user's information from the database
  const user = await User.findById(currentUserId);
  if (!user) {
    console.error(`User with ID ${currentUserId} not found`);
    return;
  }
};
*/


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
    const userId = req.locals.currentUserId;
    review.userId = userId;
    review.ownerName = (await User.findById(userId)).name;
    review.ownerImage = (await User.findById(userId)).profile_image;
    review.date = new Date().toLocaleDateString();
    const createdReview: IUserReview = await UserReview.create(review);
    res.status(201).json(createdReview);
  } catch (err) {
    res.status(400).send('Something went wrong -> createdReview');
  }
};


const adminDeleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviewId = req.params.id;
    
    const review = await UserReview.findById(reviewId);
    if (!review) {
      res.status(404).send('Review not found');
      return;
    }

    const user = await User.findById(req.locals.currentUserId);
    if (user.roles !== 'admin') {
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

    const ownerOfReview = review.userId.toString();
    const userId =user._id.toString();

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