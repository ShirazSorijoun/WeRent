import { Request, Response, NextFunction } from 'express';
import User from '../models/user_model';

interface CustomRequest extends Request {
    locals: {
      currentUserId?: string;
    };
  }

const verifyUserOwnership = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;
        const currentUserId = req.locals?.currentUserId;

        if (!id || !currentUserId) {
            return res.status(400).send('User ID and current user ID are required for verification');
        }

        const user = await User.findById(id);

        if (!user || user._id.toString() !== currentUserId) {
            return res.status(403).send('You do not have permission to modify this user');
        }

        next();
    } catch (err) {
        console.error('Error in verifyUserOwnership:', err);
        res.status(500).send('Internal Server Error -> verifyUserOwnership');
    }
}

export default verifyUserOwnership;
