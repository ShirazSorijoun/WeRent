"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const apartment_route_1 = __importDefault(require("./routes/apartment_route"));
const user_review_route_1 = __importDefault(require("./routes/user_review_route"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on('error', error => { console.error(error); });
        db.once('open', () => console.log('connected to the database'));
        const url = process.env.DATABASE_URL;
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
            app.use(body_parser_1.default.json());
            // Enable CORS for all routes
            app.use((0, cors_1.default)());
            app.use("/auth", auth_route_1.default);
            app.use("/user", user_route_1.default);
            app.use("/apartment", apartment_route_1.default);
            app.use("/userReview", user_review_route_1.default);
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map