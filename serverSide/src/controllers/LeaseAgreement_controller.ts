import { Request, Response } from 'express';
import LeaseAgreement, { ILeaseAgreement } from '../models/LeaseAgreement_model';
import User, { UserRole } from '../models/user_model';
import Apartment from '../models/apartment_model';


interface AuthRequest extends Request {
    locals?: {
      currentUserId?: string;
      currentUserRole?: UserRole;
    };
}



const createLeaseAgreement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { leaseAgreement } = req.body;
      console.log(leaseAgreement)


      // Set the date based on the current date
      leaseAgreement.date_dayOfTheMonth = new Date().getDate();
      leaseAgreement.date_month = new Date().getMonth();
      leaseAgreement.date_year = new Date().getFullYear();

      // Set the owner based on the current user
      const ownerId = req.locals.currentUserId;
      const owner = await User.findById(ownerId);
      if (!owner){
        res.status(404).json({ message: 'Owner not found' })
        return;
      }
      leaseAgreement.ownerName = owner.name
      leaseAgreement.ownerId = ownerId
      //leaseAgreement.ownerIDNumber = owner.IDNumber
      //leaseAgreement.ownerStreet = owner.street
      //leaseAgreement.ownerCity = owner.city


      const tenant = await User.findById(leaseAgreement.tenantId);
      if (!tenant) {
        res.status(404).json({ message: 'Tenant not found' });
        return;
      }
      leaseAgreement.tenantName = tenant.name
      //leaseAgreement.tenantIDNumber = tenant.IDNumber
      //leaseAgreement.tenantStreet = tenant.street
      //leaseAgreement.tenantCity = tenant.city


      const apartment = await Apartment.findById(leaseAgreement.apartmentId);
      if (!apartment){
        res.status(404).json({ message: 'Apartment not found' });
        return;
      }
      leaseAgreement.apartmentNumberOfRooms = apartment.rooms
      leaseAgreement.apartmentFloorNumber = apartment.floor
      leaseAgreement.apartmentStreet = apartment.address
      leaseAgreement.apartmentCity = apartment.city


      const createdLeaseAgreement: ILeaseAgreement = await LeaseAgreement.create(leaseAgreement);
      res.status(201).json(createdLeaseAgreement);
    } catch (err) {
      res.status(400).send('Something went wrong -> createdReview');
    }
};



/*
const createLeaseAgreement =async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { leaseAgreement } = req.body;
    console.log('LeaseAgreement', leaseAgreement);
    leaseAgreement.owner = req.locals.currentUserId;
    const createdForm = await LeaseAgreement.create(leaseAgreement);

    res.status(201).json(createdForm);

  } catch (error) {
    console.error(error);
    res.status(400).send('Something went wrong -> createTenantForm');
  }
};
*/




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
}   


//Editing before signing
const updateLeaseAgreement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { updateLeaseAgreement } = req.body;

        // Validate owner
        const ownerId = req.locals.currentUserId;
        const owner = await User.findById(ownerId);
        if (!owner){
            res.status(404).json({ message: 'Owner not found' });
            return;
        }

        if (ownerId !== updateLeaseAgreement.ownerId){
            res.status(403).json({ message: 'You do not have permission to perform this operation' });
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
}


export default {
    createLeaseAgreement,
    getLeaseAgreementById,
    deleteLeaseAgreement,
    updateLeaseAgreement
  };