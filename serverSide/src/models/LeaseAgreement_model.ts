import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILeaseAgreement extends Document {
    date_dayOfTheMonth: number;
    date_month: number;
    date_year: number;

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
    startDate: string;
    endDate: string;
    rentalPricePerMonth: number;
    dayOfTheMonthForPayment: number;
    paymentMethod: string;

    nameOfBank?: string;
    bankAccountNumber?: string;
    bankBranch?: string;

    optionPeriod: string;
    optionPeriodLength?: number;
    maxPercentageIncrease?: number;
    maxNumOfMonthsIncludeOptionPeriod?: number;
    numOfDaysForRepair: number;
    subtenant: string;
    numOfDaysPaymentDelay: number;

    promissoryNote: string;
    promissoryNoteAmount?: number;
    letterOfGuarantee: string;
    guarantee?: string;
    guaranteeAmount?: number;
    animal: string;
}

const LeaseAgreementSchema: Schema<ILeaseAgreement> = new mongoose.Schema({
    date_dayOfTheMonth: {
        type: Number,
        default: new Date().getDate()
    }, 
    date_month: {
        type: Number,
        default: new Date().getMonth()
    },
    date_year: {
        type: Number,
        default: new Date().getFullYear()
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
        type: String,
        required: true,
    },
    endDate: {
        type: String,
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
        type: String,
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
        type: String,
        required: true,
    },
    numOfDaysPaymentDelay: {
        type: Number,
        required: true,
    },
    promissoryNote: { //Appendix D - שטר חוב
        type: String,
        required: true,
    },
    promissoryNoteAmount: {
        type: Number,
        required: false,
    },
    letterOfGuarantee: { //Appendix C - כתב ערבות
        type: String,
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
        type: String,
        required: true,
    }
});

const LeaseAgreement = mongoose.model<ILeaseAgreement>('LeaseAgreement', LeaseAgreementSchema);
export default LeaseAgreement;
