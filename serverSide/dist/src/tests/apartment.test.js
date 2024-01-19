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
const apartment_model_1 = __importDefault(require("../models/apartment_model"));
let app;
let accessTokenUser1;
let accessTokenUser2;
let accessTokenUser3;
let user1Id;
let apartment1Id;
let apartment2Id;
const user1 = {
    name: "testUser",
    email: "test@test.com",
    password: "test123",
    roles: user_model_1.UserRole.Owner,
};
const user2 = {
    name: "John",
    email: "John@test.com",
    password: "111111",
    roles: user_model_1.UserRole.Tenant
};
const user3 = {
    name: "Shani Yaish",
    email: "Shani@gmail.com",
    password: "123456",
    roles: user_model_1.UserRole.Admin
};
const apartment1 = {
    city: "Lod",
    address: "Barak 4",
    owner: "",
    floor: 2,
    rooms: 4,
    sizeInSqMeters: 105,
    entryDate: new Date("2023-02-01")
};
const apartment2 = {
    city: "Holon",
    address: "Harava 4",
    owner: "",
    floor: 6,
    rooms: 5,
    sizeInSqMeters: 120,
    entryDate: new Date("2024-06-15")
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    yield apartment_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user1.email });
    const res1 = yield (0, supertest_1.default)(app).post("/auth/register").send(user1);
    user1Id = res1.body._id;
    const response1 = yield (0, supertest_1.default)(app).post("/auth/login").send(user1);
    accessTokenUser1 = response1.body.accessToken;
    yield user_model_1.default.deleteMany({ 'email': user2.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user2);
    accessTokenUser2 = response2.body.accessToken;
    yield user_model_1.default.deleteMany({ 'email': user3.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user3);
    const response3 = yield (0, supertest_1.default)(app).post("/auth/login").send(user3);
    accessTokenUser3 = response3.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('Apartment post Controller Tests', () => {
    test("Test Get All Apartments posts - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/apartment");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post Apartment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/apartment/create")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send({ apartment: apartment1 });
        const response2 = yield (0, supertest_1.default)(app)
            .post("/apartment/create")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send({ apartment: apartment2 });
        apartment1Id = response.body._id;
        apartment2Id = response2.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(user1Id);
        expect(response.body.city).toBe(apartment1.city);
        expect(response.body.address).toBe(apartment1.address);
    }));
    test("Test Post Apartment - Tenant", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/apartment/create")
            .set("Authorization", "JWT " + accessTokenUser2)
            .send({ apartment: apartment1 });
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe("Not Owner");
    }));
    test("Test Get All Apartments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/apartment/");
        expect(response.statusCode).toBe(200);
    }));
    test("Test Get My Apartments - Success", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/apartments/")
            .set("Authorization", "JWT " + accessTokenUser1);
        const rc = response.body.myApartments[0];
        //console.log( response.body)
        expect(response.statusCode).toBe(200);
        expect(rc.owner).toBe(user1Id);
    }));
    test("Test Get My Apartments - Not Success", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/apartments/")
            .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe('Not Owner');
    }));
    test("Test Delete Apartment - Own Apartment ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/apartment/delete/${apartment1Id}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
    }));
    test("Test The apartment has been deleted from the array of user1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/user/apartments/`)
            .set("Authorization", "JWT " + accessTokenUser1);
        const rc = response.body.myApartments[0];
        expect(response.statusCode).toBe(200);
        expect(rc.city).toBe(apartment2.city);
    }));
    test("Test Apdate Apartment - by admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            city: 'Updated City',
            address: 'Updated Address',
            floor: 3,
            rooms: 3,
            sizeInSqMeters: 110,
            entryDate: '2024-08-01'
        };
        const response = yield (0, supertest_1.default)(app)
            .patch(`/apartment/update`)
            .set("Authorization", "JWT " + accessTokenUser3)
            .send({ id: apartment2Id, apartment: updateData });
        expect(response.status).toBe(200);
    }));
    test("Test Apdate Apartment - by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            city: 'Updated City2',
            address: 'Updated Address2',
            floor: 3,
            rooms: 3,
            sizeInSqMeters: 100,
            entryDate: '2024-08-01'
        };
        const response = yield (0, supertest_1.default)(app)
            .patch(`/apartment/update`)
            .set("Authorization", "JWT " + accessTokenUser1)
            .send({ id: apartment2Id, apartment: updateData });
        expect(response.status).toBe(200);
    }));
    /*test("Test Delete Apartment - Admin ", async () => {
      const response = await request(app)
      .delete(`/apartment/delete/${apartment2Id}`)
      .set("Authorization", "JWT " + accessTokenUser3);
      expect(response.statusCode).toBe(200);
    });

    test("Test The apartment has been deleted from the array of user1", async () => {
      const response = await request(app)
      .get(`/user/apartments/`)
      .set("Authorization", "JWT " + accessTokenUser1);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.myApartments).toStrictEqual([]);
    });*/
});
//# sourceMappingURL=apartment.test.js.map