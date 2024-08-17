import { Response } from 'express';
import LeaseAgreement from '../models/LeaseAgreement_model';
import Apartment from '../models/apartment_model';
import { User } from '../models/user_model';
import { AuthRequest } from '../models/request';

const createLeaseAgreement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { leaseAgreement } = req.body;

    console.log('leaseAgreement', leaseAgreement);
    // Set the date based on the current date
    const currentDate = new Date();
    leaseAgreement.date_dayOfTheMonth = currentDate.getDate();
    leaseAgreement.date_month = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    leaseAgreement.date_year = currentDate.getFullYear();

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
    leaseAgreement.ownerName = `${owner.firstName} ${owner.lastName}`;
    leaseAgreement.ownerIDNumber = 'owner.number'; // Assuming owner model has these fields
    leaseAgreement.ownerStreet = 'owner.street';
    leaseAgreement.ownerCity = 'owner.city';

    // Fetch tenant details
    const tenantId = '669b684ba664f3944e6810af'; // Assuming tenant ID is provided in the request or context
    const tenant = await User.findById(tenantId);
    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    leaseAgreement.tenantId = tenantId;
    leaseAgreement.tenantName = `${tenant.firstName} ${tenant.lastName}`;
    leaseAgreement.tenantIDNumber = 'tenant.number';
    leaseAgreement.tenantStreet = 'tenant.street';
    leaseAgreement.tenantCity = 'tenant.city';

    // Fetch apartment details
    const apartmentId = '66adfeb2dd1240b14fb70520'; // Assuming apartment ID is provided in the request or context
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      res.status(404).json({ message: 'Apartment not found' });
      return;
    }

    leaseAgreement.apartmentId = apartmentId;
    leaseAgreement.apartmentNumberOfRooms = apartment.rooms;
    leaseAgreement.apartmentFloorNumber = apartment.floor;
    leaseAgreement.apartmentStreet = apartment.address;
    leaseAgreement.apartmentCity = apartment.city;

    console.log('leaseAgreement2', leaseAgreement);
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
