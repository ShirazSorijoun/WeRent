import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Apartment from '../models/apartment_model';
import { User, IUser } from '../models/user_model';
// import AuthRequest from '../middlewares/auth_middleware';

interface CustomRequest extends Request {
  locals: {
    currentUserId?: string;
  };
}

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching users' });
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // console.log('Requested User ID:', id);
    const user = await User.findById(id);
    // console.log('User Found:', user);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error in getUserById:', err);
    res.status(500).send('Internal Server Error -> getUserById');
  }
};

const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    // console.log(user)
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send('Something went wrong -> getUserByEmail');
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Ensure that id is provided
    if (!id) {
      res.status(400).send('User ID is required for deletion');
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).send('User not found');
      return;
    }

    // Delete all apartments associated with the user
    await Apartment.deleteMany({ owner: id });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleteUser:', err);
    res.status(500).send('Internal Server Error -> deleteUser');
  }
};

const updateOwnProfile = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const { currentUserId } = req.locals;

  if (!currentUserId) {
    res.status(400).send('User ID is required for updating the profile');
    return;
  }

  console.log(req.body.user);
  const { firstName,lastName,phoneNumber,personalId,cityAddress,streetAddress, email, profile_image ,  } = req.body.user;
  if (!firstName && !lastName && !phoneNumber && !personalId && !cityAddress && !streetAddress && !email && !profile_image) {
    res
      .status(400)
      .send(
        'At least one field is required for update',
      );
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { firstName,lastName,phoneNumber,personalId,cityAddress,streetAddress, email, profile_image },
      { new: true },
    );
    console.log(updatedUser);
    if (!updatedUser) {
      res.status(404).send('User not found');
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error in updateOwnProfile:', err);
    res.status(500).send('Internal Server Error -> updateOwnProfile');
  }
};

const updateUserPass = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const { currentUserId } = req.locals;

  if (!currentUserId) {
    res.status(400).send('User ID is required for updating the profile');
    return;
  }

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword && !newPassword) {
    res.status(400).send('oldPassword and newPassword are required for update');
    return;
  }

  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (isValid) {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(newPassword, salt);

      user.password = encryptedPassword;
      await user.save();
      res.status(200).send(encryptedPassword);
    } else {
      res.status(200).send('');
    }
  } catch (err) {
    console.error('Error in updateOwnProfile:', err);
    res.status(500).send('Internal Server Error -> updateOwnProfile');
  }
};

const getMyApartments = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const { currentUserId } = req.locals;

    // Find the user by ID and populate the advertisedApartments field
    const user: IUser | null = await User.findById(currentUserId).populate(
      'advertisedApartments',
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const apartmentIds =
      user.advertisedApartments?.map(
        (apartmentId) => new mongoose.Types.ObjectId(apartmentId),
      ) ?? [];

    const apartments = await Apartment.find({
      _id: { $in: apartmentIds },
    }).exec();

    res.status(200).json(apartments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUser,
  updateOwnProfile,
  getMyApartments,
  updateUserPass,
};
