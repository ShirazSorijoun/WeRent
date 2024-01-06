"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_review_controller_1 = __importDefault(require("../controllers/user_review_controller"));
const router = express_1.default.Router();
router.get('/', user_review_controller_1.default.getAllReview);
router.post('/create', user_review_controller_1.default.createReview);
exports.default = router;
//# sourceMappingURL=user_review_route.js.map