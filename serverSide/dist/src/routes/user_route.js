"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
//import AuthMiddleware from '../middlewares/auth_middleware';
const router = express_1.default.Router();
// Routes for managing users by admin
router.get('/', user_controller_1.default.getAllUsers);
router.get('/id/:id', user_controller_1.default.getUserById);
router.get('/:email', user_controller_1.default.getUserByEmail);
router.patch('/update', user_controller_1.default.updateUser);
router.delete('/delete', user_controller_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user_route.js.map