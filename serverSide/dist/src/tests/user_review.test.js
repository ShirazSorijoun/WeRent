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
const user_review_model_1 = __importDefault(require("../models/user_review_model"));
let app;
let accessTokenUser;
let accessTokenUser2;
let accessTokenUser3;
let reviewId;
let review2Id;
const user = {
    name: "Shiraz",
    email: "test@test.com",
    password: "test123",
    roles: user_model_1.UserRole.Tenant,
};
const user2 = {
    name: "John",
    email: "John@gmail.com",
    password: "11111111",
    roles: user_model_1.UserRole.Admin,
};
const user3 = {
    name: "Shani",
    email: "shani@gmail.com",
    password: "123456",
    roles: user_model_1.UserRole.Owner,
};
const userReview = {
    userId: "",
    ownerName: "",
    description: "Great!",
};
const userReview2 = {
    userId: "",
    ownerName: "",
    description: "Hello World!",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    yield user_review_model_1.default.deleteMany();
    const res = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    userReview.ownerName = res.body.name;
    userReview.userId = res.body._id;
    userReview2.ownerName = res.body.name;
    userReview2.userId = res.body._id;
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessTokenUser = response.body.accessToken;
    yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user2);
    accessTokenUser2 = response2.body.accessToken;
    yield (0, supertest_1.default)(app).post("/auth/register").send(user3);
    const response3 = yield (0, supertest_1.default)(app).post("/auth/login").send(user3);
    accessTokenUser3 = response3.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User review tests', () => {
    test("Test Get All User reviews - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userReview");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test create User review", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("User Review to Send:", userReview);
        const response = yield (0, supertest_1.default)(app).post("/userReview/create")
            .set("Authorization", "JWT " + accessTokenUser)
            .send({ review: userReview });
        reviewId = response.body._id;
        const response2 = yield (0, supertest_1.default)(app).post("/userReview/create")
            .set("Authorization", "JWT " + accessTokenUser)
            .send({ review: userReview2 });
        review2Id = response2.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(userReview);
    }));
    test("Test delete User review By Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/userReview/admin/${reviewId}`)
            .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Review deleted successfully');
    }));
    test("Test delete User review By not the owner of the review", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/userReview/${review2Id}`)
            .set("Authorization", "JWT " + accessTokenUser3);
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Only owner can delete reviews');
    }));
    test("Test delete User review By the owner of the review", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/userReview/${review2Id}`)
            .set("Authorization", "JWT " + accessTokenUser);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Review deleted successfully');
    }));
});
//# sourceMappingURL=user_review.test.js.map