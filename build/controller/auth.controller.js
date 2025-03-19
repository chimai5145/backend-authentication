"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandler = void 0;
const zod_1 = require("zod");
const catchError_1 = __importDefault(require("../util/catchError"));
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(5).max(255),
    password: zod_1.z.string().min(6).max(255),
    confirmPassword: zod_1.z.string().min(6).max(255),
    userAgent: zod_1.z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password not match",
    path: ["confirmPassword"]
});
exports.registerHandler = (0, catchError_1.default)(async (req, res) => {
    // Validate request
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"]
    });
    // Call service
    // Return respond
});
