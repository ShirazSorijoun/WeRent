import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUserReview extends Document{
  userId: Types.ObjectId;
  name: string;
  message: string;
}

//const userReviewSchema = new mongoose.Schema<IUserReview>({
const userReviewSchema: Schema<IUserReview> = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
});

const UserReview = mongoose.model<IUserReview>("UserReview", userReviewSchema);
export default UserReview;


//export default mongoose.model<IUserReview>("UserReview", userReviewSchema);



/*
import mongoose from "mongoose";

export interface IUserReview {
  title: string;
  message: string;
  owner: string;
}

const userReviewSchema = new mongoose.Schema<IUserReview>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUserReview>("UserReview", userReviewSchema);
*/