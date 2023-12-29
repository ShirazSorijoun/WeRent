import { Request, Response } from "express";
import User from '../models/user_model';
import bcrypt from 'bcrypt';


const register = async (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password || !name) {
        return res.status(400).send("missing email or password or name");
    }
    try {
        const rs = await User.findOne({ 'email': email });
        if (rs != null) {
            return res.status(406).send("email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const rs2 = await User.create({
            'name': name,
            'email': email,
            'password': encryptedPassword
        });
        return res.status(201).send(rs2);

    } catch (error) {
        res.status(400).send("error");
    }
}


const login = async (req: Request, res: Response) => {
    res.status(400).send("unimplemented-login");
}


const logout = async (req: Request, res: Response) => {
    res.status(400).send("unimplemented-logout");
}

export default {
    register,
    login,
    logout
}