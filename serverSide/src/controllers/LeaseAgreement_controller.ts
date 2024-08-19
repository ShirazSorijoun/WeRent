import { Response } from 'express';
import LeaseAgreement, {
  ILeaseAgreement,
} from '../models/LeaseAgreement_model';
import { AuthRequest } from '../models/request';
import Apartment from '../models/apartment_model';

const createLeaseAgreement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { leaseAgreement, tenantId, apartmentId } = req.body;

    console.log('leaseAgreement', leaseAgreement);

    leaseAgreement.tenantId = tenantId;
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

const getLeaseAgreementByApartmentAndUserId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { tenantId, apartmentId } = req.params;
    const leaseAgreement = await LeaseAgreement.findOne({
      apartmentId,
      tenantId,
    });

    res.status(200).json(leaseAgreement.toJSON());
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
      _id: existingLeaseAgreement.apartmentId,
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

const getLeaseAgreementListByUserId = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const leaseAgreements = await LeaseAgreement.find();
    const totalLeaseAgreements = [];

    for (let leaseAgreement of leaseAgreements) {
      if (leaseAgreement.tenantId.toString() == userId) {
        totalLeaseAgreements.push(leaseAgreement);
      } else {
        const apartment = await Apartment.findOne({ _id: leaseAgreement.apartmentId});
        if (apartment.owner.toString() == userId) {
          totalLeaseAgreements.push(leaseAgreement);
        }
      }
    }

    res.status(200).json(totalLeaseAgreements);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong -> getLeaseAgreementListByUserId');
  }
};

export default {
  createLeaseAgreement,
  getLeaseAgreementById,
  deleteLeaseAgreement,
  updateLeaseAgreement,
  getLeaseAgreementByApartmentAndUserId,
  getLeaseAgreementListByUserId,
};
