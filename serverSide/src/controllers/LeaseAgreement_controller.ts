import { Response } from 'express';
import mongoose from 'mongoose';
import LeaseAgreement, {
  ILeaseAgreement,
} from '../models/LeaseAgreement_model';
import { AuthRequest } from '../models/request';
import Apartment from '../models/apartment_model';
import { User } from '../models/user_model';

import { format } from 'date-fns';

export const createLeaseAgreement = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { leaseAgreement, tenantId, apartmentId } = req.body;

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

export const getLeaseAgreementByApartmentAndTenant = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { tenantId, apartmentId } = req.query;
    const leaseAgreement = await LeaseAgreement.findOne({
      apartment: apartmentId,
      tenantId,
    });

    res.status(200).json(leaseAgreement?.toJSON());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaseAgreementByApartmentId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { apartment } = req.params;

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

    existingLeaseAgreement.tenantSignature = undefined;
    existingLeaseAgreement.tenantSignature = undefined;

    await existingLeaseAgreement.save();
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

export const renderLeaseAgreementDocument = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const leaseAgreement = await LeaseAgreement.findById(id);

    if (!leaseAgreement) {
      return res.status(404).json({ message: 'Lease Agreement not found' });
    }

    // Fetch tenant details
    const tenant = await User.findById(leaseAgreement.tenantId);

    // Fetch apartment details and apartment owner details
    const apartment = await Apartment.findById(leaseAgreement.apartment).populate('owner');
    const apartmentOwner = await User.findById(apartment.owner);

    // Format dates
    const formattedDate = format(leaseAgreement.date, 'dd/MM/yyyy');
    const formattedStartDate = format(leaseAgreement.startDate, 'dd/MM/yyyy');
    const formattedEndDate = format(leaseAgreement.endDate, 'dd/MM/yyyy');

    // Prepare data for the template
    const templateData = {
      lease: {
        ...leaseAgreement.toObject(),
        formattedDate,
        formattedStartDate,
        formattedEndDate,
        tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'N/A',
        apartmentOwnerName: apartmentOwner ? `${apartmentOwner.firstName} ${apartmentOwner.lastName}` : 'N/A',
        apartmentAddress: apartment ? `${apartment.address}, ${apartment.city}` : 'N/A',
      },
    };

    // Render the Handlebars template with the data
    res.render('lease', templateData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rendering lease agreement document');
  }
};