import { Request, RequestHandler, Response } from "express";
import { IRegister } from "../types/register.type";
import { User } from "../models/user.model";
import { signPayload } from "../utils/jwt";
import nodemailer from "nodemailer";
import { ILogin } from "../types/login.types";

export const register: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstname, lastname, email, password } = req.body as IRegister;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered!" });
    }

    
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
        html: "<b>Hey there!</b><br> You successfully registered.<br/>",
    };

    await transporter.sendMail(mailData);
    
    const newUser = await User.create({ firstname, lastname, email, password });
    
    const token = signPayload(newUser._id.toString());

    return res.status(201).json({ message: "Successfully registered", token });
  } catch (error) {
    
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
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
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

