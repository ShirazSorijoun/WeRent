import express from 'express';
import matchController from '../controllers/match_controller';
import AuthMiddleware from '../common/auth_middleware';

const router = express.Router();

router.post('/', AuthMiddleware, matchController.createMatch);

router.get('/:apartmentId', matchController.getMatchesByApartmentId);

router.get(
  '/status/:apartmentId',
  AuthMiddleware,
  matchController.getMatchStatus,
);

router.put('/accept', AuthMiddleware, matchController.acceptMatch);

export default router;
