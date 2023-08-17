"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
exports.router = (0, express_1.Router)();
exports.router.post('/auth/register', auth_controller_1.register);
exports.router.post('/auth/login', auth_controller_1.login);
exports.router.post('/auth/verify', auth_controller_1.verify);
