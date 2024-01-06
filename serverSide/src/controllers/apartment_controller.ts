import { Request, Response } from 'express';
import Apartment from '../models/apartment_model';
//import AuthRequest  from '../middlewares/auth_middleware';


interface AuthRequest extends Request {
    locals: {
      currentUserId?: string;
    };
}

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
      res.status(200).json(apartment);
    } catch (err) {
      res.status(400).send('Something went wrong -> getApartmentById');
    }
};

const createApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { apartment } = req.body;
    // Set the owner based on the current user
    apartment.owner = req.locals.currentUserId;
    const createdApartment = await Apartment.create(apartment);
    res.status(201).json(createdApartment);
  } catch (err) {
    res.status(400).send('Something went wrong -> createApartment');
  }
};

const updateApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, apartment } = req.body;
    // Ensure the logged-in user is the owner of the apartment
    if (!apartment.owner.equals(req.locals.currentUserId)) {
      res.status(403).send('Access denied');
      return;
    }
    
    const updatedApartment = await Apartment.findByIdAndUpdate(id, apartment, { new: true });
    if (!updatedApartment) {
      res.status(400).send('Something went wrong -> updateApartment');
    } else {
      res.status(200).json(updatedApartment);
    }
  } catch (err) {
    res.status(400).send('Something went wrong -> updateApartment');
  }
};

const deleteApartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    // Ensure the logged-in user is the owner of the apartment
    const apartment = await Apartment.findById(id);
    if (!apartment || !apartment.owner.equals(req.locals.currentUserId)) {
      res.status(403).send('Access denied');
      return;
    }
    await Apartment.findByIdAndDelete(id);
    res.status(200).send('Apartment deleted successfully');
  } catch (err) {
    res.status(400).send('Something went wrong -> deleteApartment');
  }
};

export default {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
};

