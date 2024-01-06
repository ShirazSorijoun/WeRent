"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apartment_controller_1 = __importDefault(require("../controllers/apartment_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const owner_middleware_1 = __importDefault(require("../common/owner_middleware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const verify_user_ownership_1 = __importDefault(require("../common/verify_user_ownership"));
const router = express_1.default.Router();
router.get('/', apartment_controller_1.default.getAllApartments);
router.get('/:id', apartment_controller_1.default.getApartmentById);
// Allow admin to edit and delete any apartment
router.patch('/admin/update', auth_middleware_1.default, admin_middleware_1.default, apartment_controller_1.default.updateApartment);
router.delete('/admin/delete/:id', auth_middleware_1.default, admin_middleware_1.default, apartment_controller_1.default.deleteApartment);
//Allow owner to create, edit, and delete their own apartments
router.post('/create', auth_middleware_1.default, owner_middleware_1.default, apartment_controller_1.default.createApartment);
router.patch('/update', auth_middleware_1.default, verify_user_ownership_1.default, apartment_controller_1.default.updateApartment);
router.delete('/delete/:id', auth_middleware_1.default, apartment_controller_1.default.deleteApartment);
exports.default = router;
//# sourceMappingURL=apartment_route.js.map