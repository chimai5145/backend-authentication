"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const catchError_1 = __importDefault(require("./util/catchError"));
const http_1 = require("./config/http");
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: config_1.configs.frontend_url,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.get("/", (0, catchError_1.default)(async (_req, res, next) => {
    // throw new Error("This is a test error");
    res.status(http_1.OK).json({
        status: "healthy"
    });
}));
// Auth
app.use("/auth", auth_router_1.default);
app.use(errorHandler_1.default);
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});
