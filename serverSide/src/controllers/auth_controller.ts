import { Request, Response } from "express";
import User from '../models/user_model';
//import { UserRole } from "../models/user_model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const register = async (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.roles;

    if (!email || !password || !name || !role) {
        return res.status(400).send("missing email or password or name or role");
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
            'password': encryptedPassword,
            'roles': role
        });
        return res.status(201).send(rs2);

    } catch (error) {
        res.status(400).send("error");
    }
}


const login = async (req: Request, res: Response) => {
    console.log("login");
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

        const accessToken = await jwt.sign(
            { '_id': user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION}
        );

        const refreshToken = await jwt.sign(
            { '_id': user._id },
            process.env.JWT_REFRESH_SECRET
        )

        if (user.tokens == null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        await user.save();

        return res.status(200).send({'accessToken': accessToken, 'refreshToken': refreshToken});

    } catch (error) {
        res.status(400).send("error");
    }
}


const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: {'_id': string}) => {
        console.log(err);
        if (err) {
            return res.sendStatus(401);
        }
        try{
            const userFromDb = await User.findOne({'_id': user._id});
            if (!userFromDb.tokens || !userFromDb.tokens.includes(refreshToken)) {
                userFromDb.tokens = [];
                await userFromDb.save();
                return res.sendStatus(401);
            }else{
                userFromDb.tokens = userFromDb.tokens.filter((token) => token !== refreshToken);
                await userFromDb.save();
                return res.status(200);
            }
        }catch (err) {
            res.sendStatus(401).send(err.message);
        }
    });
}


const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: {'_id': string}) => {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try{
            const userFromDb = await User.findOne({'_id': user._id});
            if (!userFromDb.tokens || !userFromDb.tokens.includes(refreshToken)) {
                userFromDb.tokens = []; //invalidates all user tokens
                await userFromDb.save();
                return res.sendStatus(401);
            }

            //in case everything is fine
            const accessToken = jwt.sign(
                { '_id': user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION}
            );
            const newRefreshToken = jwt.sign(
                { '_id': user._id },
                process.env.JWT_REFRESH_SECRET
            );

            userFromDb.tokens = userFromDb.tokens.filter((token) => token !== refreshToken);
            userFromDb.tokens.push(newRefreshToken);
            await userFromDb.save();
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': refreshToken
            });
        }catch (err) {
            res.sendStatus(401).send(err.message);
        }
    });
}

export default {
    register,
    login,
    logout,
    refresh,
}