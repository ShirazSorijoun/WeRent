import { Request, Response } from 'express';
import TenantFormInitial from '../models/tenant_form_initial';
import TenantQuestionnaireQuarterly from '../models/tenant_form_quarterly';
import { AuthRequest } from '../models/request';

const createTenantFormInitial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { tenantForm } = req.body;
    console.log('tenantForm', tenantForm);
    tenantForm.owner = req.locals.currentUserId;
    const createdForm = await TenantFormInitial.create(tenantForm);

    res.status(201).json(createdForm);
  } catch (error) {
    console.error(error);
    res.status(400).send('Something went wrong -> createTenantForm');
  }
};

const getTenantFormInitialByOwnerId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { ownerId } = req.params;
    console.log('ownerId', ownerId);
    const tenantForm = await TenantFormInitial.findOne({ owner: ownerId });
    console.log('tenantForm', tenantForm);
    if (tenantForm) {
      console.log('tenantForm', tenantForm);
      res.status(200).json(tenantForm);
    } else {
      res.status(404).json({ message: 'Tenant form not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const createTenantFormQuarterly = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { tenantForm } = req.body;
    console.log('tenantForm', tenantForm);
    tenantForm.owner = req.locals.currentUserId;
    const createdForm = await TenantQuestionnaireQuarterly.create(tenantForm);

    res.status(201).json(createdForm);
  } catch (error) {
    console.error(error);
    res.status(400).send('Something went wrong -> createTenantForm');
  }
};

const getTenantFormQuarterlyByOwnerId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { ownerId } = req.params;
    console.log('ownerId', ownerId);
    const tenantForm = await TenantQuestionnaireQuarterly.findOne({
      owner: ownerId,
    });
    console.log('tenantForm', tenantForm);
    if (tenantForm) {
      console.log('tenantForm', tenantForm);
      res.status(200).json(tenantForm);
    } else {
      res.status(404).json({ message: 'Tenant form not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export default {
  createTenantFormInitial,
  getTenantFormInitialByOwnerId,
  createTenantFormQuarterly,
  getTenantFormQuarterlyByOwnerId,
};
