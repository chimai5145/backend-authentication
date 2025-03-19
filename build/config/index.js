"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
require("dotenv/config");
const firebase_config_1 = require("./firebase.config");
exports.configs = {
    db: firebase_config_1.db,
    rtdb: firebase_config_1.rtdb,
    auth: firebase_config_1.auth,
    frontend_url: process.env.FRONTEND_URL || ""
};
