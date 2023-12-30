"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
<<<<<<< HEAD
const auth_middleware_1 = __importDefault(require("../middlewares/auth_middleware"));
const router = express_1.default.Router();
// Routes for managing users by admin
router.get('/', user_controller_1.default.getAllUsers);
router.get('/id/:id', auth_middleware_1.default, user_controller_1.default.getUserById);
router.get('/:email', user_controller_1.default.getUserByEmail);
router.patch('/update', user_controller_1.default.updateUser);
router.delete('/delete', user_controller_1.default.deleteUser);
=======
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const router = express_1.default.Router();
// Routes for managing users by admin
router.get('/', auth_middleware_1.default, user_controller_1.default.getAllUsers);
router.get('/id/:id', auth_middleware_1.default, user_controller_1.default.getUserById);
router.get('/:email', auth_middleware_1.default, user_controller_1.default.getUserByEmail);
router.patch('/update', auth_middleware_1.default, user_controller_1.default.updateUser);
router.delete('/delete', auth_middleware_1.default, user_controller_1.default.deleteUser);
>>>>>>> cff3e50168e937d3ea670323d3ce0c9820ac0f97
exports.default = router;
//# sourceMappingURL=user_route.js.map