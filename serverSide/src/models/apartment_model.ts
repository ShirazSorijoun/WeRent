import mongoose, { Document, Schema } from 'mongoose';

export interface IApartment extends Document {
  city: string;
  address: string;
  type: string;
  owner: mongoose.Schema.Types.ObjectId;
  floor: number;
  numberOfFloors: number;
  rooms: number;
  sizeInSqMeters: number;
  price: number;
  entryDate: Date;
  apartment_image?: string;
  furniture?: string;
  features?: {
    parking: boolean;
    accessForDisabled: boolean;
    storage: boolean;
    dimension: boolean;
    terrace: boolean;
    garden: boolean;
    elevators: boolean;
    airConditioning: boolean;
  };
  description?: string;
  phone?: string;
  coordinate?: {
    lng: number;
    lat: number;
  };
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
  type: {
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
  numberOfFloors: {
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
  price: {
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
    default: 'https://www.freeiconspng.com/uploads/no-image-icon-4.png',
  },
  furniture: {
    type: String,
    default: 'none',
  },
  features: {
    parking: {
      type: Boolean,
      default: false,
    },
    accessForDisabled: {
      type: Boolean,
      default: false,
    },
    storage: {
      type: Boolean,
      default: false,
    },
    dimension: {
      type: Boolean,
      default: false,
    },
    terrace: {
      type: Boolean,
      default: false,
    },
    garden: {
      type: Boolean,
      default: false,
    },
    elevators: {
      type: Boolean,
      default: false,
    },
    airConditioning: {
      type: Boolean,
      default: false,
    },
  },
  description: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
  },
  coordinate: {
    lng: {
      type: Number,
      required: false,
    },
    lat: {
      type: Number,
      required: false,
    },
  },
});

const Apartment = mongoose.model<IApartment>('Apartment', apartmentSchema);

export default Apartment;
