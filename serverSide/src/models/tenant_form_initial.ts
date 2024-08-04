import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITenantQuestionnaireInitialy extends Document {
  owner: mongoose.Schema.Types.ObjectId;
  rentalAgreement: boolean;
  rentalAgreementComments?: string;
  propertyInformation: boolean;
  propertyInformationComments?: string;
  leaseSigningProcess: boolean;
  leaseSigningProcessComments?: string;
  questionsAddressed: boolean;
  questionsAddressedComments?: string;
  propertyCondition: boolean;
  propertyConditionComments?: string;
  receivedInformation: boolean;
  transitionProblems?: string;
  satisfactionRating: number;
  maintenanceRequests: boolean;
  maintenanceRequestsComments?: string;
  firstImpression?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const tenantQuestionnaireInitialySchema: Schema<ITenantQuestionnaireInitialy> =
  new Schema(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rentalAgreement: {
        type: Boolean,
        required: true,
      },
      rentalAgreementComments: {
        type: String,
        default: '',
      },
      propertyInformation: {
        type: Boolean,
        required: true,
      },
      propertyInformationComments: {
        type: String,
        default: '',
      },
      leaseSigningProcess: {
        type: Boolean,
        required: true,
      },
      leaseSigningProcessComments: {
        type: String,
        default: '',
      },
      questionsAddressed: {
        type: Boolean,
        required: true,
      },
      questionsAddressedComments: {
        type: String,
        default: '',
      },
      propertyCondition: {
        type: Boolean,
        required: true,
      },
      propertyConditionComments: {
        type: String,
        default: '',
      },
      receivedInformation: {
        type: Boolean,
        required: true,
      },
      transitionProblems: {
        type: String,
        default: '',
      },
      satisfactionRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      maintenanceRequests: {
        type: Boolean,
        required: true,
      },
      maintenanceRequestsComments: {
        type: String,
        default: '',
      },
      firstImpression: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true, // Automatically manages createdAt and updatedAt fields
    },
  );

const TenantQuestionnaireInitial: Model<ITenantQuestionnaireInitialy> = mongoose.model(
  'TenantQuestionnaireInitial',
  tenantQuestionnaireInitialySchema,
);

export default TenantQuestionnaireInitial;
