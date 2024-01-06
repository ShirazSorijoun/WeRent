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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importStar(require("../models/user_model"));
//import { UserRole } from "../models/user_model";
let app;
const user = {
    name: "testUser",
    email: "test@test.com",
    password: "test123",
    roles: user_model_1.UserRole.Admin
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany({ 'email': user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let accessToken;
let refreshToken;
describe("Auth test", () => {
    test("Test Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(201);
    }));
    test("Test Register exist email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(406);
    }));
    test("Test Register missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register").send({
            name: "testUser",
            email: "test@test.com"
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Register missing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register").send({
            name: "testUser",
            password: "test123"
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Register missing name", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register").send({
            email: "test@test.com",
            password: "test123"
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Register short password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register").send({
            name: "Short",
            email: "Short@test.com",
            password: "11",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
    }));
    test("Test forbidden access without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user");
        expect(response.statusCode).toBe(401);
    }));
    test("Test access with valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Test access with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT 1" + accessToken);
        expect(response.statusCode).toBe(401);
    }));
    jest.setTimeout(10000);
    test("Test access after timeout of token", () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(() => resolve("done"), 5000));
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        const newAccessToken = response.body.accessToken;
        const response2 = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + newAccessToken);
        expect(response2.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=auth.test.js.map