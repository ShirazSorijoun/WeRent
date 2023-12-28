import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  Admin = 'admin',
  Owner = 'owner',
  Tenant = 'tenant',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles?: UserRole;
  advertisedApartments?: string[];
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles:
    {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Tenant,
    },
  advertisedApartments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
    },
  ],
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;