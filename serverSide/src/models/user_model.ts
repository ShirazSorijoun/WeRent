import mongoose, { Document, Schema } from 'mongoose';

export const googleDefaultPass = 'sign by google';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile_image?: string;
  advertisedApartments?: string[];
  tokens?: string[];
  isAdmin?: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_image: {
    type: String,
    trim: true,
    default: 'user_vector.png',
  },
  advertisedApartments: [
    {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
  ],
  tokens: {
    type: [String],
    required: false,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
