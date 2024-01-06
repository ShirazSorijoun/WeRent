"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apartmentSchema = new mongoose_1.default.Schema({
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    floor: {
        type: Number,
        required: true,
    },
    rooms: {
        type: Number,
        required: true,
    },
    sizeInSqMeters: {
        type: Number,
        required: true,
    },
    entryDate: {
        type: Date,
        required: true,
    },
});
const Apartment = mongoose_1.default.model('Apartment', apartmentSchema);
exports.default = Apartment;
//# sourceMappingURL=apartment_model.js.map