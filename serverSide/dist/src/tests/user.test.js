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
let app;
let accessTokenUser1;
let accessTokenUser2;
let user1Id;
let user2Id;
let user3Id;
const user1 = {
    name: "testUser",
    email: "test@test.com",
    password: "test123",
    roles: user_model_1.UserRole.Admin
};
const user2 = {
    name: "Shani",
    email: "shani@test.com",
    password: "123456",
    roles: user_model_1.UserRole.Owner
};
const user3 = {
    name: "John",
    email: "John@test.com",
    password: "1111",
    roles: user_model_1.UserRole.Tenant
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    user_model_1.default.deleteMany({ 'email': user1.email });
    const res1 = yield (0, supertest_1.default)(app).post("/auth/register").send(user1);
    user1Id = res1.body._id;
    //console.log(user1Id)
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user1);
    accessTokenUser1 = response.body.accessToken;
    //console.log(accessToken)
    user_model_1.default.deleteMany({ 'email': user2.email });
    const res2 = yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
    user2Id = res2.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user2);
    accessTokenUser2 = response2.body.accessToken;
    //console.log(accessToken2)
    user_model_1.default.deleteMany({ 'email': user3.email });
    const res3 = yield (0, supertest_1.default)(app).post("/auth/register").send(user3);
    user3Id = res3.body._id;
    yield (0, supertest_1.default)(app).post("/auth/login").send(user3);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User Controller Tests', () => {
    test("Test Get All Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/")
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Get All Users - not admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/")
            .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(401);
    }));
    test("Test Get User by Email", () => __awaiter(void 0, void 0, void 0, function* () {
        const userEmail = user2.email;
        const response = yield (0, supertest_1.default)(app).get(`/user/${userEmail}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Update - Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: user2Id,
            user: {
                name: "Shani Yaish",
                email: "update@gmail.com",
                password: "55555",
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .patch("/user/update")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send(updateData);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe("Shani Yaish");
    }));
    test("Test Update - Not Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: user1Id,
            user: {
                name: "testtt",
                email: "update@gmail.com",
                password: "55555",
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .patch("/user/update")
            .set("Authorization", "JWT " + accessTokenUser2)
            .send(updateData);
        expect(response.statusCode).toBe(401);
    }));
    test("Test Update User - User Not Found", () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentUserId = "6592857c6341227f90e3fdd3";
        const updateData = {
            id: nonExistentUserId,
            user: {
                name: "Updated Name",
                email: "updated.email@example.com",
                password: "updatedPassword123",
            },
        };
        const response = yield (0, supertest_1.default)(app)
            .patch("/user/update")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send(updateData);
        expect(response.statusCode).toBe(404);
    }));
    test('Test Delete User by ID - Admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const deleteResponse = yield (0, supertest_1.default)(app)
            .delete(`/user/delete/${user3Id}`)
            .set('Authorization', 'JWT ' + accessTokenUser1);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('User deleted successfully');
        // Check that the user is really deleted by trying to fetch it
        const getUserResponse = yield (0, supertest_1.default)(app)
            .get(`/user/id/${user3Id}`)
            .set('Authorization', 'JWT ' + accessTokenUser1);
        expect(getUserResponse.status).toBe(404);
    }));
    test('Test Update Own Profile - Success', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: user2Id,
            user: {
                name: 'Updated Name',
                email: 'updated.email@example.com',
                password: '8888888',
            },
        };
        const response = yield (0, supertest_1.default)(app)
            .patch('/user/updateOwnProfile')
            .set('Authorization', 'JWT ' + accessTokenUser2)
            .send(updateData);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Updated Name');
        // Check that the user's profile is updated
        const updatedUserResponse = yield (0, supertest_1.default)(app)
            .get(`/user/id/${user2Id}`)
            .set('Authorization', 'JWT ' + accessTokenUser1);
        expect(updatedUserResponse.status).toBe(200);
        expect(updatedUserResponse.body.name).toBe('Updated Name');
    }));
    test('Test Update Own Profile - Not his own profile', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: user1Id,
            user: {
                name: 'Updated Name',
                email: 'updated.email@example.com',
                password: '8888888',
            },
        };
        const response = yield (0, supertest_1.default)(app)
            .patch('/user/updateOwnProfile')
            .set('Authorization', 'JWT ' + accessTokenUser2)
            .send(updateData);
        expect(response.statusCode).toBe(403);
    }));
});
//# sourceMappingURL=user.test.js.map