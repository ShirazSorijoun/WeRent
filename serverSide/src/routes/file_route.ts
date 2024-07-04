import express from 'express';
import authMiddleware from '../common/auth_middleware';
import fileController from '../controllers/file_controller';
import { uploadFile } from './utils';

const router = express.Router();

router.post(
  '/upload/:fileName?',
  uploadFile.single('file'),
  fileController.uploadImage,
);

router.post(
  '/upload-valuable',
  authMiddleware,
  uploadFile.single('file'),
  fileController.uploadValuable,
);

router.post(
  '/verify-document',
  authMiddleware,
  uploadFile.single('file'),
  fileController.verifyDocument,
);

export = router;
