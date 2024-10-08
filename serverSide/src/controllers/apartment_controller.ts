import { Request, Response } from 'express';
import Apartment from '../models/apartment_model';
import { CircularBoundary } from '../models/circular_boundry';
import { QuadTreeSingleton } from '../models/quadtree_apartment_list';
import { User } from '../models/user_model';
import { AuthRequest } from '../models/request';

const DEFAULT_RADIUS = 5000;

export const searchPointsWithinRadius = async (req: Request, res: Response) => {
  const { apartmentId, radius } = req.params;

  const apartment = await Apartment.findById(apartmentId);

  if (!apartment?.coordinate) {
    // Apartment not found
    res.status(404).json({ message: 'Apartment not found' });
    return;
  }

  const selectedRadius: number = radius ? +radius : DEFAULT_RADIUS;

  if (selectedRadius <= 0) {
    return res.status(400).send('Invalid input');
  }

  // Get the singleton instance of the QuadTree
  const quadTreeInstance = await QuadTreeSingleton.getInstance();
  const { quadTree } = quadTreeInstance;

  // Create a circular boundary using the provided radius in meters
  const range = new CircularBoundary(
    apartment.coordinate.lat,
    apartment.coordinate.lng,
    selectedRadius,
  );
  const foundPoints = quadTree.query(range);

  res
    .status(200)
    .json(foundPoints.map((point) => ({ x: point.x, y: point.y })));
};

export const getAllApartments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const apartments = await Apartment.find();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching apartments' });
  }
};

export const getAllApartmentsWithoutLLease = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const apartments = await Apartment.find({ leaseId: { $exists: false } });
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching apartments' });
  }
};

export const getApartmentById = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

export const getApartmentByIds = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { ids } = req.query;

    const apartments = await Apartment.find({
      _id: { $in: ids },
    });

    if (!apartments?.length) {
      // Apartment not found
      res.status(404).json({ message: ' no apartments were found' });
      return;
    }

    res.status(200).json(apartments);
  } catch (err) {
    // Internal Server Error
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createApartment = async (
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

export const updateApartment = async (
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

export const deleteApartment = async (
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
