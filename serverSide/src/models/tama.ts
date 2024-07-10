import mongoose, { Document, Schema } from 'mongoose';

export interface ITama extends Document {
  full_address: string;
  lat: number;
  lng: number;
}

const tamaSchema: Schema<ITama> = new mongoose.Schema({
  full_address: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const Tama = mongoose.model<ITama>('Tama', tamaSchema);

export default Tama;
