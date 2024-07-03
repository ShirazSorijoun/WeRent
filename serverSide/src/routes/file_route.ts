import express from 'express';
import multer from 'multer';
import authMiddleware from '../common/auth_middleware';
import fileController from '../controllers/file_controller';

const router = express.Router();

const base = 'http://localhost:3000/';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/');
  },
  filename(req, file, cb) {
    const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), fileController.uploadImage);

router.post(
  '/upload-valuable',
  authMiddleware,
  upload.single('file'),
  fileController.uploadValuable,
);

router.post(
  '/verify-document',
  authMiddleware,
  upload.single('file'),
  fileController.verifyDocument,
);

export = router;
