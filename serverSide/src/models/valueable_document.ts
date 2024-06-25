import mongoose, { Schema, Document } from 'mongoose';

interface ValuableDocument extends Document {
  userId: string;
  fileHash: string;
  signature: string;
  publicKey: string;
  createdAt: Date;
}

const ValuableDocumentSchema: Schema = new Schema({
  userId: { type: String, required: true },
  fileHash: { type: String, required: true },
  signature: { type: String, required: true },
  publicKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ValuableDocumentModel = mongoose.model<ValuableDocument>('ValuableDocument', ValuableDocumentSchema);

export default ValuableDocumentModel;
