"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const verifyUserOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.body;
        const currentUserId = (_a = req.locals) === null || _a === void 0 ? void 0 : _a.currentUserId;
        if (!id || !currentUserId) {
            return res.status(400).send('User ID and current user ID are required for verification');
        }
        const user = yield user_model_1.default.findById(id);
        if (!user || user._id.toString() !== currentUserId) {
            return res.status(403).send('You do not have permission to modify this user');
        }
        next();
    }
    catch (err) {
        console.error('Error in verifyUserOwnership:', err);
        res.status(500).send('Internal Server Error -> verifyUserOwnership');
    }
});
exports.default = verifyUserOwnership;
//# sourceMappingURL=verify_user_ownership.js.map