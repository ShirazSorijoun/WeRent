"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["Owner"] = "owner";
    UserRole["Tenant"] = "tenant";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.Tenant,
    },
    profile_image: {
        type: String,
        trim: true,
        default: "https://www.freeiconspng.com/uploads/no-image-icon-4.png",
    },
    advertisedApartments: [
        {
            type: mongoose_1.default.Schema.Types.Mixed,
        },
    ],
    tokens: {
        type: [String],
        required: false,
    },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user_model.js.map