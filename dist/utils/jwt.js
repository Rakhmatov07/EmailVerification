"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayload = exports.signPayload = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sign, verify } = jsonwebtoken_1.default;
const JWT_KEY = process.env.JWT_KEY;
const signPayload = (payload) => sign(payload, JWT_KEY);
exports.signPayload = signPayload;
const verifyPayload = (payload) => verify(payload, JWT_KEY);
exports.verifyPayload = verifyPayload;
