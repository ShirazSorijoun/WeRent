import { Request, Response } from 'express';
import User from '../models/user_model';
import bcrypt from 'bcrypt';
//import AuthRequest from '../middlewares/auth_middleware';

interface CustomRequest  extends Request {
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

    //console.log('Requested User ID:', id);
    const user = await User.findById(id);
    //console.log('User Found:', user);

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
    //console.log(user)
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send('Something went wrong -> getUserByEmail');
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    const { name, email, password } = req.body.user;

    // Ensure that at least one field is provided for update
    if (!name && !email && !password) {
      res.status(400).send('At least one field (name, email, or password) is required for update');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, encryptedPassword },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).send('User not found');
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error in updateUser:', err);
    res.status(500).send('Internal Server Error -> updateUser');
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

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleteUser:', err);
    res.status(500).send('Internal Server Error -> deleteUser');
  }
};


const updateOwnProfile = async (req: CustomRequest, res: Response): Promise<void> => {

    const { currentUserId } = req.locals;

    if (!currentUserId) {
      res.status(400).send('User ID is required for updating the profile');
      return;
    }

    const { name, email, password } = req.body.user;
    
    if (!name && !email && !password) {
      res.status(400).send('At least one field (name, email, or password) is required for update');
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      const updatedUser = await User.findByIdAndUpdate(
        currentUserId,
        { name, email, encryptedPassword },
        { new: true }
      );

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



export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  updateOwnProfile,
};


