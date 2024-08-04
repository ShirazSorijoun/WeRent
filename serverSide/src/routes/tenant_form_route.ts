import express from 'express';
import AuthMiddleware from '../common/auth_middleware';
import TenantFormController from '../controllers/tenant_form_controller';

const router = express.Router();

router.post(
  '/create',
  AuthMiddleware,
  TenantFormController.createTenantFormInitial,
);

export default router;
