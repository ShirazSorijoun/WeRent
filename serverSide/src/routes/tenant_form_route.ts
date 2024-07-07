import express from 'express';
import TenantFormController from '../controllers/tenant_form_controller';


const router = express.Router();

router.post('/create', TenantFormController.createTenantForm);

export default router;
