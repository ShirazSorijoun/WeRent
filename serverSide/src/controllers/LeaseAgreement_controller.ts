import { Response } from 'express';
import LeaseAgreement from '../models/LeaseAgreement_model';
import { User } from '../models/user_model';
import { AuthRequest } from '../models/request';
import Match from '../models/match';

const createLeaseAgreement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { leaseAgreement, matchId } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      res.status(400).json({ message: 'Match information is missing' });
      return;
    }

    console.log('leaseAgreement', leaseAgreement);

    // Set the date based on the current date
    leaseAgreement.date = new Date();

    // Set the owner based on the current user
    const ownerId = req.locals?.currentUserId;
    if (!ownerId) {
      res.status(400).json({ message: 'Owner ID is missing' });
      console.log('Owner ID is missing');
      return;
    }

    const owner = await User.findById(ownerId);
    if (!owner) {
      res.status(404).json({ message: 'Owner not found' });
      console.log('Owner not found');
      return;
    }

    leaseAgreement.ownerId = ownerId;

    // Fetch tenant details
    const tenantId = match.user; // Assuming tenant ID is provided in the request or context
    leaseAgreement.tenantId = tenantId;

    // Fetch apartment details
    const apartmentId = match.apartment; // Assuming apartment ID is provided in the request or context
    leaseAgreement.apartmentId = apartmentId;

    const createdLeaseAgreement = await LeaseAgreement.create(leaseAgreement);
    res.status(201).json(createdLeaseAgreement);
  } catch (err) {
    console.error(err);
    res.status(400).send('Something went wrong -> createLeaseAgreement');
  }
};

const getLeaseAgreementById = async (req: AuthRequest, res: Response) => {
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

const deleteLeaseAgreement = async (req: AuthRequest, res: Response) => {
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
const updateLeaseAgreement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { updateLeaseAgreement } = req.body;

    // Validate owner
    const ownerId = req.locals.currentUserId;
    const owner = await User.findById(ownerId);
    if (!owner) {
      res.status(404).json({ message: 'Owner not found' });
      return;
    }

    if (ownerId !== updateLeaseAgreement.ownerId) {
      res.status(403).json({
        message: 'You do not have permission to perform this operation',
      });
      return;
    }

    const existingLeaseAgreement = await LeaseAgreement.findById(id);
    if (!existingLeaseAgreement) {
      res.status(404).send('Lease Agreement not found');
      return;
    }

    await existingLeaseAgreement.updateOne(updateLeaseAgreement);

    res.status(200).json(existingLeaseAgreement.toJSON());
  } catch (err) {
    console.error(err);
    res.status(400).send('Something went wrong -> updateApartment');
  }
};

export default {
  createLeaseAgreement,
  getLeaseAgreementById,
  deleteLeaseAgreement,
  updateLeaseAgreement,
};
