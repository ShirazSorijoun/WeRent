import { Response } from 'express';
import mongoose from 'mongoose';
import LeaseAgreement, {
  ILeaseAgreement,
} from '../models/LeaseAgreement_model';
import { AuthRequest } from '../models/request';
import Apartment from '../models/apartment_model';

export const createLeaseAgreement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { leaseAgreement, tenantId, apartmentId } = req.body;

    console.log('leaseAgreement', leaseAgreement);

    leaseAgreement.tenantId = tenantId;
    leaseAgreement.apartment = apartmentId;

    const createdLeaseAgreement = await LeaseAgreement.create(leaseAgreement);
    res.status(201).json(createdLeaseAgreement);
  } catch (err) {
    console.error(err);
    res.status(400).send('Something went wrong -> createLeaseAgreement');
  }
};

export const getLeaseAgreementById = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = req.params;
    const leaseAgreement = await LeaseAgreement.findById(id);
    if (!leaseAgreement) {
      return res.status(404).json({ message: 'Lease Agreement not found' });
    }
    res.status(200).json(leaseAgreement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaseAgreementByApartmentAndUserId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { tenantId, apartmentId } = req.params;
    const leaseAgreement = await LeaseAgreement.findOne({
      apartment: apartmentId,
      tenantId,
    });

    res.status(200).json(leaseAgreement.toJSON());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaseAgreementByApartmentId = async (
  req: AuthRequest,
  res: Response,
) => {
  console.log('Entering getLeaseAgreementByApartmentId function');

  try {
    console.log('Request received');
    const { apartment } = req.params;
    console.log('apartmentId:', apartment);

    if (!apartment) {
      console.log('No apartmentId provided');
      return res.status(400).json({ message: 'Apartment ID is required' });
    }

    const leaseAgreement = await LeaseAgreement.findOne({
      apartment,
    });

    if (!leaseAgreement) {
      console.log('Lease agreement not found for apartmentId:', apartment);
      return res.status(404).json({ message: 'Lease agreement not found' });
    }

    console.log('Lease agreement found:', leaseAgreement);
    res.status(200).json(leaseAgreement.toJSON());
  } catch (err) {
    console.log('Error occurred:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const deleteLeaseAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params;
    const leaseAgreement = await LeaseAgreement.findByIdAndDelete(id);
    if (!leaseAgreement) {
      return res.status(404).json({ message: 'Lease Agreement not found' });
    }
    res.status(200).json({ message: 'Lease Agreement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Editing before signing
export const updateLeaseAgreement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      updatedLeaseAgreement,
      leaseId,
    }: { updatedLeaseAgreement: ILeaseAgreement; leaseId: string } = req.body;

    const existingLeaseAgreement = await LeaseAgreement.findById(leaseId);

    if (!existingLeaseAgreement) {
      res.status(404).send('Lease Agreement not found');
      return;
    }

    // Validate owner
    const ownerId = req.locals.currentUserId;

    if (!ownerId) {
      res.status(400).send('User ID is required for updating the lease');
      return;
    }

    const isOwnerValid = await Apartment.exists({
      _id: existingLeaseAgreement.apartment,
      owner: ownerId,
    });

    if (!isOwnerValid) {
      res.status(403).json({
        message: 'You do not have permission to perform this operation',
      });
      return;
    }

    await existingLeaseAgreement.updateOne(updatedLeaseAgreement);

    res.status(200).json(existingLeaseAgreement.toJSON());
  } catch (err) {
    console.error(err);
    res.status(400).send('Something went wrong -> updateApartment');
  }
};

export const getLeaseAgreementListByUserId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.locals.currentUserId);

    const leaseAgreements = await LeaseAgreement.aggregate([
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
        $match: { $or: [{ tenantId: userId }, { 'apartment.owner': userId }] },
      },
    ]);

    res.status(200).json(leaseAgreements);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send('Something went wrong -> getLeaseAgreementListByUserId');
  }
};
