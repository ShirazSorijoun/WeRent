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
const apartment_model_1 = __importDefault(require("../models/apartment_model"));
const getAllApartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apartments = yield apartment_model_1.default.find();
        res.status(200).json(apartments);
    }
    catch (error) {
        res.status(500).send({ message: 'Error fetching apartments' });
    }
});
const getApartmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const apartment = yield apartment_model_1.default.findById(id);
        res.status(200).json(apartment);
    }
    catch (err) {
        res.status(400).send('Something went wrong -> getApartmentById');
    }
});
const createApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apartment } = req.body;
        // Set the owner based on the current user
        apartment.owner = req.locals.currentUserId;
        const createdApartment = yield apartment_model_1.default.create(apartment);
        res.status(201).json(createdApartment);
    }
    catch (err) {
        res.status(400).send('Something went wrong -> createApartment');
    }
});
const updateApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, apartment } = req.body;
        // Ensure the logged-in user is the owner of the apartment
        if (!apartment.owner.equals(req.locals.currentUserId)) {
            res.status(403).send('Access denied');
            return;
        }
        const updatedApartment = yield apartment_model_1.default.findByIdAndUpdate(id, apartment, { new: true });
        if (!updatedApartment) {
            res.status(400).send('Something went wrong -> updateApartment');
        }
        else {
            res.status(200).json(updatedApartment);
        }
    }
    catch (err) {
        res.status(400).send('Something went wrong -> updateApartment');
    }
});
const deleteApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        // Ensure the logged-in user is the owner of the apartment
        const apartment = yield apartment_model_1.default.findById(id);
        if (!apartment || !apartment.owner.equals(req.locals.currentUserId)) {
            res.status(403).send('Access denied');
            return;
        }
        yield apartment_model_1.default.findByIdAndDelete(id);
        res.status(200).send('Apartment deleted successfully');
    }
    catch (err) {
        res.status(400).send('Something went wrong -> deleteApartment');
    }
});
exports.default = {
    getAllApartments,
    getApartmentById,
    createApartment,
    updateApartment,
    deleteApartment,
};
//# sourceMappingURL=apartment_controller.js.map