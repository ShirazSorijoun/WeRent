import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILeaseAgreement extends Document {
    date_dayOfTheMonth: string;
    date_month: string;
    date_year: string;

    ownerId: Types.ObjectId;
    ownerName: string;
    ownerIDNumber: string;
    ownerStreet: string;
    ownerCity: string;

    tenantId: Types.ObjectId;
    tenantName: string;
    tenantIDNumber: string;
    tenantStreet: string;
    tenantCity: string;

    apartmentId: Types.ObjectId;
    apartmentNumberOfRooms: number;
    apartmentFloorNumber: number;
    apartmentStreet: string;
    apartmentCity: string;

    numOfRentalMonths: number;
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
    maxNumOfMonthsIncludeOptionPeriod?: number;
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
    date_dayOfTheMonth: {
        type: String,
        default: new Date().getDate().toString()
    }, 
    date_month: {
        type: String,
        default: new Date().getMonth().toString()
    },
    date_year: {
        type: String,
        default: new Date().getFullYear().toString()
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    ownerIDNumber: {
        type: String,
        required: true,
    },
    ownerStreet: {
        type: String,
        required: true,
    },
    ownerCity: {
        type: String,
        required: true,
    },
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tenantName: {
        type: String,
        required: true,
    },
    tenantIDNumber: {
        type: String,
        required: true,
    },
    tenantStreet: {
        type: String,
        required: true,
    },
    tenantCity: {
        type: String,
        required: true,
    },
    apartmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true,
    },
    apartmentNumberOfRooms: {
        type: Number,
        required: true,
    },
    apartmentFloorNumber: {
        type: Number,
        required: true,
    },
    apartmentStreet: {
        type: String,
        required: true,
    },
    apartmentCity: {
        type: String,
        required: true,
    },
    numOfRentalMonths: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    rentalPricePerMonth: {
        type: Number,
        required: true,
    },
    dayOfTheMonthForPayment: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Checks'],
        required: true,
    },
    nameOfBank: {
        type: String,
        required: false,
    },
    bankAccountNumber: {
        type: String,
        required: false,
    },
    bankBranch: {
        type: String,
        required: false,
    },
    optionPeriod: {
        type: Boolean,
        required: true,
    },
    optionPeriodLength: { //amount of months
        type: Number,
        required: false,
    },
    maxPercentageIncrease: {
        type: Number,
        required: false,
    },
    maxNumOfMonthsIncludeOptionPeriod: { //numberOfRentalMonths + optionPeriodLength
        type: Number,
        required: false,
    },
    numOfDaysForRepair: {
        type: Number,
        required: true,
    },
    subtenant: { //12.2
        type: Boolean,
        required: true,
    },
    numOfDaysPaymentDelay: {
        type: Number,
        required: true,
    },
    promissoryNote: { //Appendix D - שטר חוב
        type: Boolean,
        required: true,
    },
    promissoryNoteAmount: {
        type: Number,
        required: false,
    },
    letterOfGuarantee: { //Appendix C - כתב ערבות
        type: Boolean,
        required: true,
    },
    guarantee: {
        type: String,
        enum: ['Financial deposit', 'Autonomous bank guarantee'],
        required: false,
    },
    guaranteeAmount: {
        type: Number,
        required: false,
    },
    animal: { //17.2
        type: Boolean,
        required: true,
    }
});

const LeaseAgreement = mongoose.model<ILeaseAgreement>('LeaseAgreement', LeaseAgreementSchema);
export default LeaseAgreement;
