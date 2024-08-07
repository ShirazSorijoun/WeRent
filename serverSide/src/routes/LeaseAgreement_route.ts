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

export default router;
