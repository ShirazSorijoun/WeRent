import express from 'express';
import LeaseAgreementController from '../controllers/LeaseAgreement_controller';
import AuthMiddleware from '../common/auth_middleware';

const router = express.Router();

router.post(
  '/create',
  AuthMiddleware,
  LeaseAgreementController.createLeaseAgreement,
);
router.get('/:id', LeaseAgreementController.getLeaseAgreementById);
router.get(
  '/:tenantId/:apartmentId',
  AuthMiddleware,
  LeaseAgreementController.getLeaseAgreementByApartmentAndUserId,
);
router.delete(
  '/delete/:id',
  AuthMiddleware,
  LeaseAgreementController.deleteLeaseAgreement,
);
router.patch(
  '/update',
  AuthMiddleware,
  LeaseAgreementController.updateLeaseAgreement,
);
router.get(
    '/list',
    LeaseAgreementController.getLeaseAgreementListByUserId,
);

export default router;
