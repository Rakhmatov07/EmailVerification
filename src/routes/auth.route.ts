import { Router } from "express";
import { login, register, verify } from "../controllers/auth.controller";
export const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/verify', verify);