import { Request, Response } from "express";
import Apartment from "../models/apartment_model";
import User, { UserRole } from "../models/user_model";
import AuthRequest from "../common/auth_middleware";

interface AuthRequest extends Request {
  locals?: {
    currentUserId?: string;
    currentUserRole?: UserRole;
  };
}

const getAllApartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const apartments = await Apartment.find();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).send({ message: "Error fetching apartments" });
  }
};

const getApartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);

    if (!apartment) {
      // Apartment not found
      res.status(404).json({ message: "Apartment not found" });
      return;
    }

    res.status(200).json(apartment);
  } catch (err) {
    // Internal Server Error
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createApartment = async (
  req: AuthRequest,
  res: Response
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
        { $addToSet: { advertisedApartments: createdApartment } },
        { new: true }
      ).populate("advertisedApartments");

      res.status(201).json(createdApartment);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong -> createApartment");
  }
};

const updateApartment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
  const { id, updatedApartment } = req.body;
    // Ensure the logged-in user is the owner of the apartment or an admin
    const existingApartment = await Apartment.findById(id);
    if (!existingApartment) {
      res.status(404).send("Apartment not found");
      return;
    }

    const ownerOfApartment = await User.findById(
      existingApartment.owner.toString()
    );
    const user = await User.findById(req.locals.currentUserId);
    const role = user.roles;

    if (
      role !== UserRole.Admin &&
      ownerOfApartment._id.toString() !== req.locals.currentUserId
    ) {
      res.status(403).send("Access denied");
      return;
    }

    const apartmentToApdate = await Apartment.findByIdAndUpdate(
      id,
      {
        city: updatedApartment.city,
        address: updatedApartment.address,
        type: updatedApartment.type,
        floor: updatedApartment.floor,
        numberOfFloors: updatedApartment.numberOfFloors,
        rooms: updatedApartment.rooms,
        sizeInSqMeters: updatedApartment.sizeInSqMeters,
        price: updatedApartment.price,
        entryDate: updatedApartment.entryDate,
        furniture: updatedApartment.furniture,
        features: {
          parking: updatedApartment.features.parking,
          accessForDisabled: updatedApartment.features.accessForDisabled,
          storage: updatedApartment.features.storage,
          dimension: updatedApartment.features.dimension,
          terrace: updatedApartment.features.terrace,
          garden: updatedApartment.features.garden,
          elevators: updatedApartment.features.elevators,
          airConditioning: updatedApartment.features.airConditioning,
        },
        description: updatedApartment.description,
        phone: updatedApartment.phone,
      },
      { new: true }
    );

    if (!apartmentToApdate) {
      res.status(400).send("Something went wrong -> updateApartment");
      return;
    }

    // Update the corresponding user's advertisedApartments array
    const userUpdate = await User.findByIdAndUpdate(
      ownerOfApartment,
      { $pull: { advertisedApartments: { _id: apartmentToApdate._id } } },
      { new: true }
    );

    if (!userUpdate) {
      res.status(500).send("Internal Server Error -> updateUser");
      return;
    }

    // Add the updated apartment to the user's advertisedApartments array
    await User.findByIdAndUpdate(
      ownerOfApartment,
      { $addToSet: { advertisedApartments: apartmentToApdate } },
      { new: true }
    ).populate("advertisedApartments");

    res.status(200).json(apartmentToApdate);
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong -> updateApartment");
  }
};

const deleteApartment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const apartmentId = req.params.id;
    const apartment = await Apartment.findById(apartmentId);

    const currentUserId = req.locals.currentUserId;
    const user = await User.findById(currentUserId);
    const role = user.roles;

    const ownerOfTheApartment = apartment.owner.toString();

    if (!apartment) {
      res.status(404).send("Apartment not found");
      return;
    }

    if (ownerOfTheApartment !== currentUserId && role !== UserRole.Admin) {
      res.status(403).send("Access denied");
      return;
    }

    await Apartment.findByIdAndDelete(apartmentId);

    await User.findByIdAndUpdate(
      ownerOfTheApartment,
      { $pull: { advertisedApartments: { _id: apartment._id } } },
      { new: true }
    );

    res.status(200).send("Apartment deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export default {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
};
