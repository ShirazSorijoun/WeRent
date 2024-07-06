import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITenantQuestionnaire extends Document {
  owner: mongoose.Schema.Types.ObjectId;
  rentalAgreement: 'Yes' | 'No';
  rentalAgreementComments?: string;
  propertyInformation: 'Yes' | 'No';
  propertyInformationComments?: string;
  leaseSigningProcess: 'Yes' | 'No';
  leaseSigningProcessComments?: string;
  questionsAddressed: 'Yes' | 'No';
  questionsAddressedComments?: string;
  propertyCondition: 'Yes' | 'No';
  propertyConditionComments?: string;
  receivedInformation: 'Yes' | 'No';
  transitionProblems?: string;
  satisfactionRating: number;
  maintenanceRequests: 'Yes' | 'No';
  maintenanceRequestsComments?: string;
  firstImpression?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const tenantQuestionnaireSchema: Schema<ITenantQuestionnaire> = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rentalAgreement: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
  },
  rentalAgreementComments: {
    type: String,
    default: '',
  },
  propertyInformation: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
  },
  propertyInformationComments: {
    type: String,
    default: '',
  },
  leaseSigningProcess: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
  },
  leaseSigningProcessComments: {
    type: String,
    default: '',
  },
  questionsAddressed: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
  },
  questionsAddressedComments: {
    type: String,
    default: '',
  },
  propertyCondition: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
  },
  propertyConditionComments: {
    type: String,
    default: '',
  },
  receivedInformation: {
    type: String,
    enum: ['Yes', 'No'],
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
    type: String,
    enum: ['Yes', 'No'],
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
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});


const TenantQuestionnaire: Model<ITenantQuestionnaire> = mongoose.model('TenantQuestionnaire', tenantQuestionnaireSchema);

export default TenantQuestionnaire;

