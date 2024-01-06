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
const user = {
    name: "Shiraz",
    email: "test@test.com",
    password: "test123",
    roles: user_model_1.UserRole.Admin,
};
const userReview = {
    userId: "",
    ownerName: user.name,
    description: "Great!",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    yield user_review_model_1.default.deleteMany();
    const res = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    userReview.userId = res.body._id;
    console.log(user);
    accessTokenUser = res.body.accessToken;
    //const response =await request(app).post("/auth/login").send(user);
    console.log(userReview);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User review tests', () => {
    /*
    test("Test Get All User reviews - empty response", async () => {
        const response = await request(app).get("/userReview");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

   
    test("Test create User review", async () => {
        const response = await request(app).post("/userReview").send(userReview);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(userReview);
    });
    */
    test("Test create User review", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/userReview/create")
            .set("Authorization", "JWT " + accessTokenUser)
            .send({ userReview: userReview });
        console.log(response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(userReview);
        /*
        expect(response.body.userId).toBe(userReview.userId);
        expect(response.body.ownerName).toBe(userReview.ownerName);
        expect(response.body.description).toBe(userReview.description);
        */
    }));
    test("Test delete User review", () => __awaiter(void 0, void 0, void 0, function* () {
        //const reviewId = ; //id_of_the_review_to_delete
        const response = yield (0, supertest_1.default)(app).delete(`/userReview/${reviewId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Review deleted successfully' });
    }));
});
//# sourceMappingURL=user_review.test.js.map