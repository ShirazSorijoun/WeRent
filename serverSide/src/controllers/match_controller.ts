import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Apartment from '../models/apartment_model';
import { User } from '../models/user_model';
import Match from '../models/match';
import { AuthRequest } from '../models/request';

export const createMatch = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { apartmentId } = req.body;

    // Check if apartment and user exist
    const apartment = await Apartment.exists({ _id: apartmentId });
    const user = await User.exists({ _id: req.locals.currentUserId });

    if (!apartment) {
      res.status(404).send('Apartment not found');
      return;
    }

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    // Create a new match
    const match = new Match({
      apartment: apartmentId,
      user: req.locals.currentUserId,
    });

    await match.save();

    res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getMatchesByApartmentId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { apartmentId } = req.params;

    if (!apartmentId) {
      res.status(400).send('Apartment ID is required');
      return;
    }

    const matches = await Match.find({ apartment: apartmentId }).populate([
      {
        path: 'user',
        select: 'profile_image email firstName lastName _id',
      },
      {
        path: 'apartment',
        select: 'leaseId _id',
      },
    ]);

    if (!matches || matches.length === 0) {
      res.status(404).send('No matches found');
      return;
    }

    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getMatchesByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).send('user ID is required');
      return;
    }

    const userIdForDB = new mongoose.Types.ObjectId(userId);

    const matches = await Match.aggregate([
      {
        $lookup: {
          from: Apartment.collection.name,
          localField: 'apartment',
          foreignField: '_id',
          as: 'apartment',
        },
      },
      {
        $unwind: '$apartment',
      },
      {
        $match: {
          $or: [{ user: userIdForDB }, { 'apartment.owner': userIdForDB }],
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]);

    if (!matches || matches.length === 0) {
      res.status(404).send('No matches found');
      return;
    }

    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getMatchStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { apartmentId } = req.params;

    if (!apartmentId) {
      res.status(400).send('apartment id is required ');
      return;
    }

    const match = await Match.findOne({
      apartment: apartmentId,
      user: req.locals.currentUserId,
    });

    if (!match) {
      res.status(404).send('No matches found');
    } else {
      res.status(200).json(match.accepted);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const acceptMatch = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { matchId, status } = req.body;

    if (!matchId) {
      res.status(400).send('Match ID is required');
      return;
    }

    // Fetch the match and populate the apartment field
    const match = await Match.findById(matchId);

    // Update the match to be accepted
    match.accepted = !!status;
    await match.save();

    res.status(200).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
