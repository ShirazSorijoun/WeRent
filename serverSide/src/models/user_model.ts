import mongoose, { Document, Schema } from 'mongoose';

export const googleDefaultPass = 'sign by google';
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  personalId: string;
  streetAddress: string;
  cityAddress: string;
  phoneNumber: string;
  email: string;
  password: string;
  profile_image?: string;
  advertisedApartments?: string[];
  tokens?: string[];
  isAdmin?: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
    lastName: {
        type: String,
        required: true,
    },
    personalId: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    cityAddress: {
        type: String,
        required: true,
    },
    phoneNumber: {
            type: String,
            required: true},
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
