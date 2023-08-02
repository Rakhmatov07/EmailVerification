import 'dotenv/config';
import Jwt from "jsonwebtoken";
const { sign, verify } = Jwt;
const JWT_KEY: any = process.env.JWT_KEY;


export const signPayload = (payload: string) => sign(payload, JWT_KEY);
export const verifyPayload = (payload: string) => verify(payload, JWT_KEY);