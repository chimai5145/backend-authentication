"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const authRoutes = (0, express_1.Router)();
authRoutes.post("/register", auth_controller_1.registerHandler);
exports.default = authRoutes;
