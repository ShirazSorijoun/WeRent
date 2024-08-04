import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITenantQuestionnaireQuarterly extends Document {
  owner: mongoose.Schema.Types.ObjectId;
  propertyConditionRating: number; // Satisfaction with property condition (1-5)
  maintenanceIssues: string; // Description of maintenance issues and how they were treated
  responseTimeSatisfaction: number; // Satisfaction with response time for maintenance and repair (1-5)
  ownerResponsiveness: number; // Owner/landlord responsiveness (1-5)
  comfortableRaisingConcerns: boolean; // Comfort in raising concerns (yes/no)
  comfortableRaisingConcernsComments?: string; // Comments on comfort in raising concerns
  renewalConsideration: 'Yes' | 'No' | 'Undecided'; // Considering lease renewal (yes/no/undecided)
  responseTimeToRequests:
    | 'Within 24 hours'
    | '1-3 days'
    | '4-7 days'
    | 'More than a week'; // Response time for requests
  resolutionTime:
    | 'Within 24 hours'
    | '1-3 days'
    | '4-7 days'
    | 'More than a week'; // Resolution time for maintenance
  issuesResolvedToSatisfaction: boolean; // Issues resolved to satisfaction (yes/no)
  preferredCommunicationMethod: 'Phone' | 'Email' | 'Text' | 'Personal'; // Preferred communication method
  communicationSkillsRating: number; // Rating of communication skills (1-5)
  createdAt?: Date;
  updatedAt?: Date;
}

const tenantQuestionnaireQuarterlySchema: Schema<ITenantQuestionnaireQuarterly> =
  new Schema(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      propertyConditionRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      maintenanceIssues: {
        type: String,
        default: '',
      },
      responseTimeSatisfaction: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      ownerResponsiveness: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      comfortableRaisingConcerns: {
        type: Boolean,
        required: true,
      },
      comfortableRaisingConcernsComments: {
        type: String,
      },
      renewalConsideration: {
        type: String,
        enum: ['Yes', 'No', 'Undecided'],
        required: true,
      },
      responseTimeToRequests: {
        type: String,
        enum: ['Within 24 hours', '1-3 days', '4-7 days', 'More than a week'],
        required: true,
      },
      resolutionTime: {
        type: String,
        enum: ['Within 24 hours', '1-3 days', '4-7 days', 'More than a week'],
        required: true,
      },
      issuesResolvedToSatisfaction: {
        type: Boolean,
        required: true,
      },
      preferredCommunicationMethod: {
        type: String,
        enum: ['Phone', 'Email', 'Text', 'Personal'],
        required: true,
      },
      communicationSkillsRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
    },
    {
      timestamps: true, // Automatically manages createdAt and updatedAt fields
    },
  );

const TenantQuestionnaireQuarterly: Model<ITenantQuestionnaireQuarterly> =
  mongoose.model(
    'TenantQuestionnaireQuarterly',
    tenantQuestionnaireQuarterlySchema,
  );

export default TenantQuestionnaireQuarterly;
