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
const user_review_model_1 = __importDefault(require("../models/user_review_model"));
const getAllReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield user_review_model_1.default.find();
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).send({ message: 'Error fetching reviews' });
    }
});
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { review } = req.body;
        // Set the owner based on the current user
        review.owner = req.locals.currentUserId;
        const createdReview = yield user_review_model_1.default.create(review);
        res.status(201).json(createdReview);
    }
    catch (err) {
        res.status(400).send('Something went wrong -> createdReview');
    }
});
exports.default = {
    getAllReview,
    createReview
};
//# sourceMappingURL=user_review_controller.js.map