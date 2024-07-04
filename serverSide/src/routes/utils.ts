import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { IMAGES_DIR } from '../common/imageHandler';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    return cb(null, IMAGES_DIR);
  },
  filename(req, file, cb) {
    return cb(null, uuidv4() + path.extname(file.originalname));
  },
});

export const uploadFile = multer({ storage });
