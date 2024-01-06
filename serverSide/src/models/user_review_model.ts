import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUserReview extends Document{
  userId: Types.ObjectId;
  name: string;
  description: string;
}

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
  description: {
    type: String,
    required: true,
  }
});

const UserReview = mongoose.model<IUserReview>("UserReview", userReviewSchema);
export default UserReview;