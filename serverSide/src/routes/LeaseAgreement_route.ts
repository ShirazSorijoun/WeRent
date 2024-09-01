import express from 'express';
import * as LeaseAgreementController from '../controllers/LeaseAgreement_controller';
import AuthMiddleware from '../common/auth_middleware';

const router = express.Router();

router.post(
  '/create',
  AuthMiddleware,
  LeaseAgreementController.createLeaseAgreement,
);

router.post(
  '/addSignature',
  AuthMiddleware,
  LeaseAgreementController.addSignatureToLease,
);

router.get(
  '/id/:leaseId',
  AuthMiddleware,
  LeaseAgreementController.getLeaseAgreementById,
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
  AuthMiddleware,
  LeaseAgreementController.getLeaseAgreementListByUserId,
);
router.get(
  'byApartment/:apartment',
  AuthMiddleware,
  LeaseAgreementController.getLeaseAgreementByApartmentId,
);

router.get(
  '/byApartmentAndTenant',
  AuthMiddleware,
  LeaseAgreementController.getLeaseAgreementByApartmentAndTenant,
);

// Route to Render Lease Agreement Document
router.get(
  '/render/:id',
  LeaseAgreementController.renderLeaseAgreementDocument,
);

export default router;
