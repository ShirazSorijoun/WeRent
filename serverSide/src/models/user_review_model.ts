import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserReview extends Document {
  user: Types.ObjectId;
  date: Date;
  description: string;
}

const userReviewSchema: Schema<IUserReview> = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  description: {
    type: String,
    required: true,
  },
});

const UserReview = mongoose.model<IUserReview>('UserReview', userReviewSchema);
export default UserReview;
