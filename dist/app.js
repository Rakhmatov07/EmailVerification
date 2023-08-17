"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = require("mongoose");
const routes_1 = __importDefault(require("./routes"));
const ioredis_1 = __importDefault(require("ioredis"));
exports.redis = new ioredis_1.default({
    port: 6379,
    host: '127.0.0.1',
});
const bootstrap = async () => {
    await (0, mongoose_1.connect)('mongodb://127.0.0.1:27017/sample');
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(routes_1.default);
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port: ${process.env.PORT}`);
    });
};
bootstrap();
