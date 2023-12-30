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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User Controller Tests', () => {
    test("Test Get All Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user");
        expect(response.statusCode).toBe(200);
    }));
    test("Test Get User by ID ", () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "658d76c1accde9cdd0d12bda";
        const response = yield (0, supertest_1.default)(app).get(`/user/id/${userId}`);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Get User by Email", () => __awaiter(void 0, void 0, void 0, function* () {
        const userEmail = "test@test.com";
        const response = yield (0, supertest_1.default)(app).get(`/user/${userEmail}`);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Update User", () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "659083cbfa71947bfd646418";
        const updatedUserData = {
            name: "Yuval",
            email: "updated@test.com",
            password: "123",
        };
        const response = yield (0, supertest_1.default)(app)
            .patch("/user/update")
            .send({ id: userId, user: updatedUserData });
        expect(response.statusCode).toBe(200);
    }));
    test("Test Delete User", () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "659083acfa71947bfd646414";
        const response = yield (0, supertest_1.default)(app).delete(`/user/delete?id=${userId}`);
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=user.test.js.map