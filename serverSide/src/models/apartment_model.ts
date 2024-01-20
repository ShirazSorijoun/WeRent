import mongoose, { Document, Schema} from 'mongoose';

export interface IApartment extends Document {
  city: string;
  address: string;
  owner: mongoose.Schema.Types.ObjectId; 
  floor: number;
  rooms: number;
  sizeInSqMeters: number;
  entryDate: Date;
  apartment_image?:string;
}

const apartmentSchema: Schema<IApartment> = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  sizeInSqMeters: {
    type: Number,
    required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  apartment_image: {
    type: String,
    trim: true,
    default: "https://www.freeiconspng.com/uploads/no-image-icon-4.png",
  },
});

const Apartment = mongoose.model<IApartment>('Apartment', apartmentSchema);

export default Apartment;
