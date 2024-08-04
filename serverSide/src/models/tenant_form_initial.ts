import mongoose, { Model } from 'mongoose';
import { ITenantQuestionnaire, tenantQuestionnaireSchema } from './tenant_form';

const TenantQuestionnaireInitial: Model<ITenantQuestionnaire> = mongoose.model(
  'TenantQuestionnaireInitial',
  tenantQuestionnaireSchema,
);

export default TenantQuestionnaireInitial;
