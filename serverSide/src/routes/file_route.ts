import express from 'express';
import multer from 'multer';
import fs from 'fs';
import forge from 'node-forge';
import ValuableDocumentModel from '../models/valueable_document';
import authMiddleware from '../common/auth_middleware';

const router = express.Router();

const base = 'http://localhost:3000/';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/');
  },
  filename(req, file, cb) {
    const ext = file.originalname
      .split('.')
      .filter(Boolean)
      .slice(1)
      .join('.');
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

const generateKeys = () => {
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const publicKey = forge.pki.publicKeyToPem(keys.publicKey);
  const privateKey = forge.pki.privateKeyToPem(keys.privateKey);
  return { publicKey, privateKey };
};

const signDocument = (fileContent: string, privateKeyPem: string) => {
  const md = forge.md.sha256.create();
  md.update(fileContent, 'utf8');
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const signature = privateKey.sign(md);
  return forge.util.encode64(signature);
};

const hashFileContent = (fileContent: string) => {
  const md = forge.md.sha256.create();
  md.update(fileContent, 'utf8');
  return md.digest().toHex();
};

router.post('/upload', upload.single('file'), function (req, res) {
  console.log(`router.post(/upload: ${base}${req.file.path}`);
  res.status(200).send({ url: base + req.file.path });
});

router.post('/upload-valuable', authMiddleware, upload.single('file'), async function (req: any, res) {
  const filePath = req.file.path;
  const userId = req.locals?.currentUserId; // Retrieved from the authMiddleware
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const fileHash = hashFileContent(fileContent);
  const keys = generateKeys();
  const signature = signDocument(fileContent, keys.privateKey);

  console.log(`router.post(/upload-valuable: ${base}${filePath}`);

  // Save the document metadata, signature, and public key to MongoDB
  const valuableDocument = new ValuableDocumentModel({
    userId,
    fileHash,
    signature,
    publicKey: keys.publicKey,
  });

  await valuableDocument.save();

  res.status(200).send({
    url: base + filePath,
    signature: signature,
    publicKey: keys.publicKey,
  });
});

router.post('/verify-document', authMiddleware, upload.single('file'), async function (req: any, res) {
  const userId = req.locals?.currentUserId; // Retrieved from the authMiddleware
  const filePath = req.file.path;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const fileHash = hashFileContent(fileContent);

  // Fetch the original document metadata from MongoDB
  const originalDocument = await ValuableDocumentModel.findOne({ userId, fileHash });

  if (!originalDocument) {
    return res.status(404).send({ message: 'Document not found or has been altered' });
  }

  // Decode the signature
  const decodedSignature = forge.util.decode64(originalDocument.signature);

  // Get the public key from PEM
  const publicKey = forge.pki.publicKeyFromPem(originalDocument.publicKey);

  // Verify the signature
  const md = forge.md.sha256.create();
  md.update(fileContent, 'utf8');
  const isValid = publicKey.verify(md.digest().bytes(), decodedSignature);

  if (isValid) {
    res.status(200).send({ message: 'The document is valid and has not been tampered with.' });
  } else {
    res.status(400).send({ message: 'The document has been tampered with.' });
  }
});

export = router;
