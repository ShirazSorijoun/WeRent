import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  Admin = "admin",
  Owner = "owner",
  Tenant = "tenant",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles?: UserRole;
  profile_image?: string;
  advertisedApartments?: string[];
  tokens?: string[];
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
  roles: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.Tenant,
  },
  profile_image: {
    type: String,
    trim: true,
    default: "http://localhost:3000/public/user_vector.png",
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
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
