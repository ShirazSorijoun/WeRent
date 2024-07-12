import { Request, Response } from 'express';
import TenantForm from '../models/tenant_form';

interface AuthRequest extends Request {
  locals?: {
    currentUserId?: string;
  };
}

const createTenantForm = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { tenantForm } = req.body;
    console.log('tenantForm', tenantForm);
    tenantForm.owner = req.locals.currentUserId;
    const createdForm = await TenantForm.create(tenantForm);

    res.status(201).json(createdForm);
  } catch (error) {
    console.error(error);
    res.status(400).send('Something went wrong -> createTenantForm');
  }
};

export default {
  createTenantForm,
};
