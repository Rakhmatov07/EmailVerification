"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
const nodemailer_1 = __importDefault(require("nodemailer"));
const app_1 = require("../app");
const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already registered!" });
        }
        const code = Math.floor((Math.random() * 1000000) + 1);
        await app_1.redis.set(email, code, 'EX', 60);
        const transporter = nodemailer_1.default.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: "joewillson857@gmail.com",
                pass: "pqlnlqknqedsimza",
            },
            secure: true,
        });
        const mailData = {
            from: "joewillson857@gmail.com",
            to: email,
            subject: "Registration",
            text: "Do you agree to register!",
            html: `<b>Hey there!</b><br> Your verification code: ${code}.<br/>`,
        };
        await transporter.sendMail(mailData);
        const newUser = await user_model_1.User.create({ firstname, lastname, email, password });
        const token = (0, jwt_1.signPayload)(newUser._id.toString());
        return res.status(201).json({ message: "Successfully registered", token });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await user_model_1.User.findOne({ email, password });
        if (!findUser) {
            return res.status(404).json({ message: 'Email or password is incorrect' });
        }
        const token = (0, jwt_1.signPayload)(findUser._id.toString());
        return res.status(200).json({ message: 'Successfully loggedIn', token });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
async function verify(req, res) {
    try {
        const { email, code } = req.body;
        const redisCode = await app_1.redis.get(email);
        if (code == redisCode) {
            res.status(200).json({ message: 'Success' });
        }
        else {
            res.status(409).json({ message: 'Invalide code' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}
exports.verify = verify;
