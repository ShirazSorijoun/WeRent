"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const user_model_1 = __importStar(require("../models/user_model"));
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
        if (!apartment) {
            // Apartment not found
            res.status(404).json({ message: 'Apartment not found' });
            return;
        }
        res.status(200).json(apartment);
    }
    catch (err) {
        // Internal Server Error
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
const createApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apartment } = req.body;
        //console.log(apartment)
        apartment.owner = req.locals.currentUserId;
        const createdApartment = yield apartment_model_1.default.create(apartment);
        //console.log(createdApartment)
        // Update owner's advertisedApartments array
        if (req.locals.currentUserId) {
            yield user_model_1.default.findByIdAndUpdate(req.locals.currentUserId, { $addToSet: { advertisedApartments: createdApartment } }, { new: true }).populate('advertisedApartments');
            res.status(201).json(createdApartment);
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).send('Something went wrong -> createApartment');
    }
});
const updateApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, apartment } = req.body;
        // Ensure the logged-in user is the owner of the apartment or an admin
        const existingApartment = yield apartment_model_1.default.findById(id);
        if (!existingApartment) {
            res.status(404).send('Apartment not found');
            return;
        }
        const ownerOfApartment = yield user_model_1.default.findById(existingApartment.owner.toString());
        const user = yield user_model_1.default.findById(req.locals.currentUserId);
        const role = user.roles;
        if (role !== user_model_1.UserRole.Admin && ownerOfApartment._id.toString() !== req.locals.currentUserId) {
            res.status(403).send('Access denied');
            return;
        }
        // Update apartment fields except owner
        const updatedApartment = yield apartment_model_1.default.findByIdAndUpdate(id, {
            city: apartment.city,
            address: apartment.address,
            floor: apartment.floor,
            rooms: apartment.rooms,
            sizeInSqMeters: apartment.sizeInSqMeters,
            entryDate: apartment.entryDate,
        }, { new: true });
        if (!updatedApartment) {
            res.status(400).send('Something went wrong -> updateApartment');
        }
        else {
            res.status(200).json(updatedApartment);
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).send('Something went wrong -> updateApartment');
    }
});
const deleteApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apartmentId = req.params.id;
        const apartment = yield apartment_model_1.default.findById(apartmentId);
        const currentUserId = req.locals.currentUserId;
        const user = yield user_model_1.default.findById(currentUserId);
        const role = user.roles;
        const ownerOfTheApartment = apartment.owner.toString();
        if (!apartment) {
            res.status(404).send('Apartment not found');
            return;
        }
        if (ownerOfTheApartment !== currentUserId && role !== user_model_1.UserRole.Admin) {
            res.status(403).send('Access denied');
            return;
        }
        yield apartment_model_1.default.findByIdAndDelete(apartmentId);
        yield user_model_1.default.findByIdAndUpdate(ownerOfTheApartment, { $pull: { advertisedApartments: apartment } }, { new: true });
        res.status(200).send('Apartment deleted successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
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