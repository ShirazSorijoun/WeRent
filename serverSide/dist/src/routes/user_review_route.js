"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_review_controller_1 = __importDefault(require("../controllers/user_review_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const router = express_1.default.Router();
router.get('/', auth_middleware_1.default, user_review_controller_1.default.getAllReview);
router.post('/create', auth_middleware_1.default, user_review_controller_1.default.createReview);
router.delete('/:id', auth_middleware_1.default, user_review_controller_1.default.adminDeleteReview);
exports.default = router;
//# sourceMappingURL=user_review_route.js.map