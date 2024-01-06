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
//import { UserRole } from "../models/user_model";
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.roles;
    if (!email || !password || !name || !role) {
        return res.status(400).send("missing email or password or name or role");
    }
    // Name validation
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ error: "Invalid name format" });
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }
    // Password validation
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
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
            'password': encryptedPassword,
            'roles': role
        });
        return res.status(201).send(rs2);
    }
    catch (error) {
        res.status(400).send("error");
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
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
        const accessToken = yield jsonwebtoken_1.default.sign({ '_id': user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const refreshToken = yield jsonwebtoken_1.default.sign({ '_id': user._id }, process.env.JWT_REFRESH_SECRET);
        if (user.tokens == null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        yield user.save();
        return res.status(200).send({ 'accessToken': accessToken, 'refreshToken': refreshToken });
    }
    catch (error) {
        res.status(400).send("error");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(err);
        if (err) {
            return res.sendStatus(401);
        }
        try {
            const userFromDb = yield user_model_1.default.findOne({ '_id': user._id });
            if (!userFromDb.tokens || !userFromDb.tokens.includes(refreshToken)) {
                userFromDb.tokens = [];
                yield userFromDb.save();
                return res.sendStatus(401);
            }
            else {
                userFromDb.tokens = userFromDb.tokens.filter((token) => token !== refreshToken);
                yield userFromDb.save();
                return res.status(200);
            }
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userFromDb = yield user_model_1.default.findOne({ '_id': user._id });
            if (!userFromDb.tokens || !userFromDb.tokens.includes(refreshToken)) {
                userFromDb.tokens = []; //invalidates all user tokens
                yield userFromDb.save();
                return res.sendStatus(401);
            }
            //in case everything is fine
            const accessToken = jsonwebtoken_1.default.sign({ '_id': user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ '_id': user._id }, process.env.JWT_REFRESH_SECRET);
            userFromDb.tokens = userFromDb.tokens.filter((token) => token !== refreshToken);
            userFromDb.tokens.push(newRefreshToken);
            yield userFromDb.save();
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': refreshToken
            });
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
exports.default = {
    register,
    login,
    logout,
    refresh,
};
//# sourceMappingURL=auth_controller.js.map