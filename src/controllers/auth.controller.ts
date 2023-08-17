import { Request, RequestHandler, Response } from "express";
import { IRegister } from "../types/register.type";
import { User } from "../models/user.model";
import { signPayload } from "../utils/jwt";
import nodemailer from "nodemailer";
import { ILogin } from "../types/login.types";
import { redis } from "../app";

export const register: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstname, lastname, email, password } = req.body as IRegister;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered!" });
    }

    const code: number = Math.floor((Math.random()*1000000)+1);
    await redis.set(email, code, 'EX', 60);
    
    const transporter = nodemailer.createTransport({
        port: 465, // Use port 465 for secure SSL/TLS
        host: "smtp.gmail.com",
        auth: {
            user: "joewillson857@gmail.com",
            pass: "pqlnlqknqedsimza",
        },
        secure: true,
    });
    
    
    const mailData = {
        from: "joewillson857@gmail.com",
        to: email, // Send the registration email to the provided user's email address
        subject: "Registration",
        text: "Do you agree to register!",
        html: `<b>Hey there!</b><br> Your verification code: ${code}.<br/>`,
    };

    await transporter.sendMail(mailData);
    
    
    const newUser = await User.create({ firstname, lastname, email, password });
    
    const token = signPayload(newUser._id.toString());

    return res.status(201).json({ message: "Successfully registered", token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};



export const login: RequestHandler = async(req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body as ILogin;
        const findUser = await User.findOne({ email, password });
        if(!findUser){
            return res.status(404).json({ message: 'Email or password is incorrect' });
        }

        const token = signPayload(findUser._id.toString());

        return res.status(200).json({ message: 'Successfully loggedIn', token });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function verify(req: Request, res: Response){
  try {
    const { email, code } = req.body;

    const redisCode = await redis.get(email);
    
    if(code == redisCode){
      res.status(200).json({ message: 'Success' })
    }else{
      res.status(409).json({ message: 'Invalide code' });
    }
  } catch (error) {
    res.status(500).json({ message: error})
  }
}

