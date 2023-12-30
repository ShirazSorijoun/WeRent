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
<<<<<<< HEAD
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(400).send("unimplemented-register");
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(400).send("unimplemented-login");
=======
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password || !name) {
        return res.status(400).send("missing email or password or name");
    }
    try {
        const rs = yield user_model_1.default.findOne({ 'email': email });
        if (rs != null) {
            return res.status(406).send("email already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const rs2 = yield user_model_1.default.create({
            'name': name,
            'email': email,
            'password': encryptedPassword
        });
        return res.status(201).send(rs2);
    }
    catch (error) {
        res.status(400).send("error");
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password || !name) {
        return res.status(400).send("missing email or password or name");
    }
    try {
        const user = yield user_model_1.default.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("email or password incorrect");
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        return res.status(200).send({ 'accessToken': token });
    }
    catch (error) {
        res.status(400).send("error");
    }
>>>>>>> cff3e50168e937d3ea670323d3ce0c9820ac0f97
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(400).send("unimplemented-logout");
});
exports.default = {
    register,
    login,
    logout
};
//# sourceMappingURL=auth_controller.js.map