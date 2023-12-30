import { Request, Response } from "express";
import User from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password || !name) {
        return res.status(400).send("missing email or password or name");
    }
    try {
        const user = await User.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("email or password incorrect");
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION});
        return res.status(200).send({'accessToken': token});

    } catch (error) {
        res.status(400).send("error");
    }
}


const logout = async (req: Request, res: Response) => {
    res.status(400).send("unimplemented-logout");
}

export default {
    register,
    login,
    logout
}