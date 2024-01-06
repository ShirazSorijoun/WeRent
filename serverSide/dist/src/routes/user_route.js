"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const owner_middleware_1 = __importDefault(require("../common/owner_middleware"));
const verify_user_ownership_1 = __importDefault(require("../common/verify_user_ownership"));
const router = express_1.default.Router();
// Routes for managing users by admin
router.get('/', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getAllUsers);
router.get('/id/:id', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getUserById);
router.patch('/update', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.updateUser);
router.delete('/delete/:id', auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.deleteUser);
// Routes for managing users by owner
router.get('/apartments', auth_middleware_1.default, owner_middleware_1.default, user_controller_1.default.getMyApartments);
router.patch('/updateOwnProfile', auth_middleware_1.default, verify_user_ownership_1.default, user_controller_1.default.updateOwnProfile);
router.get('/:email', auth_middleware_1.default, user_controller_1.default.getUserByEmail);
exports.default = router;
//# sourceMappingURL=user_route.js.map