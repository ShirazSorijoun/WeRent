import { Request, Response } from 'express';
import Apartment from '../models/apartment_model';
import { CircularBoundary } from '../models/circular_boundry';
import { QuadTreeSingleton } from '../models/quadtree_apartment_list';
import { User } from '../models/user_model';
import Match from '../models/match';

interface AuthRequest extends Request {
  locals?: {
    currentUserId?: string;
  };
}

export const searchPointsWithinRadius = (req: Request, res: Response) => {
  const { lat, lng, radius } = req.params;

  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    typeof radius !== 'number' ||
    radius <= 0
  ) {
    return res.status(400).send('Invalid input');
  }

  // Get the singleton instance of the QuadTree
  const quadTreeInstance = QuadTreeSingleton.getInstance();
  const { quadTree } = quadTreeInstance;

  // Create a circular boundary using the provided radius in meters
  const range = new CircularBoundary(lat, lng, radius);
  const foundPoints = quadTree.query(range);

  res.json(foundPoints.map((point) => ({ x: point.x, y: point.y })));
};

const getAllApartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const apartments = await Apartment.find();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching apartments' });
  }
};

const getApartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);

    if (!apartment) {
      // Apartment not found
      res.status(404).json({ message: 'Apartment not found' });
      return;
    }

    res.status(200).json(apartment);
  } catch (err) {
    // Internal Server Error
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createApartment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { apartment } = req.body;
    console.log(apartment);
    apartment.owner = req.locals.currentUserId;

    const createdApartment = await Apartment.create(apartment);
    console.log(createdApartment);

    // Update owner's advertisedApartments array
    if (req.locals.currentUserId) {
      await User.findByIdAndUpdate(
        req.locals.currentUserId,
        { $addToSet: { advertisedApartments: createdApartment._id } },
        { new: true },
      ).populate('advertisedApartments');

      res.status(201).json(createdApartment);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send('Something went wrong -> createApartment');
  }
};

const updateApartment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id, updatedApartment } = req.body;
    console.log(req.body);
    // Ensure the logged-in user is the owner of the apartment or an admin
    const existingApartment = await Apartment.findById(id);
    if (!existingApartment) {
      res.status(404).send('Apartment not found');
      return;
    }

    const ownerOfApartment = await User.findById(
      existingApartment.owner.toString(),
    );
    const user = await User.findById(req.locals.currentUserId);

    if (
      !user.isAdmin &&
      ownerOfApartment._id.toString() !== req.locals.currentUserId
    ) {
      res.status(403).send('Access denied');
      return;
    }

    await existingApartment.updateOne(updatedApartment);

    res.status(200).json(existingApartment.toJSON());
  } catch (err) {
    console.error(err);
    res.status(400).send('Something went wrong -> updateApartment');
  }
};

const deleteApartment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const apartmentId = req.params.id;
    const apartment = await Apartment.findById(apartmentId);

    const { currentUserId } = req.locals;
    const user = await User.findById(currentUserId);

    const ownerOfTheApartment = apartment.owner.toString();

    if (!apartment) {
      res.status(404).send('Apartment not found');
      return;
    }

    if (ownerOfTheApartment !== currentUserId && !user.isAdmin) {
      res.status(403).send('Access denied');
      return;
    }

    await Apartment.findByIdAndDelete(apartmentId);

    await User.findByIdAndUpdate(
      ownerOfTheApartment,
      { $pull: { advertisedApartments: { _id: apartment._id } } },
      { new: true },
    );

    res.status(200).send('Apartment deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const createMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { apartmentId, userId } = req.body;

    // Check if apartment and user exist
    const apartment = await Apartment.findById(apartmentId);
    const user = await User.findById(userId);

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
      user: userId,
      date: new Date(),
      accepted: false
    });

    await match.save();

    res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const getMatchesByApartmentId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { apartmentId } = req.params;

    if (!apartmentId) {
      res.status(400).send('Apartment ID is required');
      return;
    }

    const matches = await Match.find({ apartment: apartmentId }).populate({
      path: 'user',
      select: 'name email _id',
    });

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

const acceptMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.body;

    if (!matchId) {
      res.status(400).send('Match ID is required');
      return;
    }

    // Fetch the match and populate the apartment field
    const match = await Match.findById(matchId).populate('apartment');

    // Update the match to be accepted
    match.accepted = true;
    await match.save();

    res.status(200).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export default {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
  searchPointsWithinRadius,
  createMatch,
  getMatchesByApartmentId,
  acceptMatch
};
