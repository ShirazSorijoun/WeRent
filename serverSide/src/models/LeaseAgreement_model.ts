import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILeaseAgreement extends Document {
  date: Date;

  tenantId: Types.ObjectId;
  apartment: Types.ObjectId;

  startDate: Date;
  endDate: Date;
  rentalPricePerMonth: number;
  dayOfTheMonthForPayment: number;
  paymentMethod: string;

  nameOfBank?: string;
  bankAccountNumber?: string;
  bankBranch?: string;

  optionPeriod: boolean;
  optionPeriodLength?: number;
  maxPercentageIncrease?: number;
  numOfDaysForRepair: number;
  subtenant: boolean;
  numOfDaysPaymentDelay: number;

  promissoryNote: boolean;
  promissoryNoteAmount?: number;
  letterOfGuarantee: boolean;
  guarantee?: string;
  guaranteeAmount?: number;
  animal: boolean;
}

const LeaseAgreementSchema: Schema<ILeaseAgreement> = new mongoose.Schema({
  // Page 1
  date: {
    // introduction
    type: Date,
    default: new Date(),
  },
  tenantId: {
    // introduction
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },

  apartment: {
    type: Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true,
  },
  startDate: {
    // 4.1
    type: Date,
    required: true,
  },
  endDate: {
    // 4.1
    type: Date,
    required: true,
  },

  // Page 2
  rentalPricePerMonth: {
    // 5.1
    type: Number,
    required: true,
  },
  dayOfTheMonthForPayment: {
    // 5.1
    type: Number,
    required: true,
  },
  paymentMethod: {
    // 5.2
    type: String,
    enum: ['Bank Transfer', 'Checks'],
    required: true,
  },
  nameOfBank: {
    // 5.2
    type: String,
    required: false,
  },
  bankAccountNumber: {
    // 5.2
    type: String,
    required: false,
  },
  bankBranch: {
    // 5.2
    type: String,
    required: false,
  },
  optionPeriod: {
    // 6
    type: Boolean,
    required: true,
  },
  optionPeriodLength: {
    // amount of months //6.1 and 6.3.2
    type: Number,
    required: false,
  },
  maxPercentageIncrease: {
    // 6.2
    type: Number,
    required: false,
  },
  // Page 3
  numOfDaysForRepair: {
    // 9.2
    type: Number,
    required: true,
  },
  subtenant: {
    // 12.2
    type: Boolean,
    required: true,
  },

  // Page 4
  numOfDaysPaymentDelay: {
    // 14.2.1
    type: Number,
    required: true,
  },
  promissoryNote: {
    // Appendix D - שטר חוב //15.1.1 // Optional
    type: Boolean,
    required: true,
  },
  promissoryNoteAmount: {
    // 15.1.1
    type: Number,
    required: false,
  },
  letterOfGuarantee: {
    // Appendix C - כתב ערבות //15.1.2 // Optional
    type: Boolean,
    required: true,
  },
  guarantee: {
    // 15.1.3 // Optional
    type: String,
    enum: ['Financial deposit', 'Autonomous bank guarantee'],
    required: false,
  },
  guaranteeAmount: {
    // 15.1.3
    type: Number,
    required: false,
  },

  // Page 5
  animal: {
    // 17.2 // Optional
    type: Boolean,
    required: true,
  },
});

const LeaseAgreement = mongoose.model<ILeaseAgreement>(
  'LeaseAgreement',
  LeaseAgreementSchema,
);
export default LeaseAgreement;
