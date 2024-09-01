import express from 'express';
import AuthMiddleware from '../common/auth_middleware';
import TenantFormController from '../controllers/tenant_form_controller';

const router = express.Router();

router.post(
  '/initial/create',
  AuthMiddleware,
  TenantFormController.createTenantFormInitial,
);
router.get(
  '/initial/:ownerId',
  AuthMiddleware,
  TenantFormController.getTenantFormInitialByOwnerId,
);

router.post(
  '/quarterly/create',
  AuthMiddleware,
  TenantFormController.createTenantFormQuarterly,
);
router.get(
  '/quarterly/:ownerId',
  AuthMiddleware,
  TenantFormController.getTenantFormQuarterlyByOwnerId,
);

export default router;
