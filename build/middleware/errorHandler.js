"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_1 = require("../config/http");
const zod_1 = require("zod");
const handleZodError = (res, err, next) => {
    const errors = err.issues.map((error) => ({
        path: error.path.join('.'),
        message: error.message
    }));
    next((0, http_errors_1.default)(http_1.BAD_REQUEST, {
        message: err.message,
        errors
    }));
};
const errorHandler = (err, req, res, next) => {
    console.log(`PATH: ${req.path}`, err);
    if (err instanceof zod_1.z.ZodError) {
        return handleZodError(res, err, next);
    }
    next((0, http_errors_1.default)(http_1.INTERNAL_SERVER_ERROR, "Internal server error"));
};
exports.default = errorHandler;
