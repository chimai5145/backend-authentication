"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = exports.rtdb = void 0;
require("dotenv/config");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_1 = require("./http");
// Initialize database
try {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
                ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
                : undefined,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
}
catch (error) {
    throw (0, http_errors_1.default)(http_1.INTERNAL_SERVER_ERROR, 'Failed to initialize Firebase Admin SDK');
    process.exit(1);
}
// const getEnv = (key: string, defaultValue?: string): string => {
//     const value = process.env[key] || defaultValue;
//   if (value === undefined) {
//     throw createHttpError(500, Missing string environment variable for ${key}`);
//   }
//   return value;
// }
exports.rtdb = firebase_admin_1.default.database();
exports.db = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
