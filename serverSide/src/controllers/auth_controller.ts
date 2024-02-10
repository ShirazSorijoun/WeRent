import { Request, Response } from "express";
import User, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client();

// Handle Google sign-in
const googleSignin = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (email != null) {
            let user = await User.findOne({ 'email': email });
            if (user == null) {
                user = await User.create(
                    {
                        'name': payload?.name,
                        'email': email,
                        'password': '*Signed up with a Google account*',
                        'profile_image': payload?.picture
                    });
            }
            const tokens = await generateTokens(user)
            res.status(200).send(
                {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    profile_image: user.profile_image,
                    ...tokens
                })
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }

}


// Register a new user
const register = async (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.roles;
    const profile_image = req.body.profile_image;

    if (!email || !password || !name || !role) {
        return res.status(400).send("missing email or password or name or role");
      }

     // Name validation
     const nameRegex = /^[a-zA-Z0-9\s]+$/;
     if (!nameRegex.test(name)) {
          return res.status(400).json({ error: "Invalid name format" });
       }

     // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format." });
        }

     // Password validation
      if (password.length < 6) {
           return res.status(400).json({ error: "Password must be at least 6 characters long." });
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
            'roles': role,
            'profile_image': profile_image,
        });
        return res.status(201).send(rs2);

    } catch (error) {
        res.status(400).send("error");
    }
}


const generateTokens = async (user: IUser) => {
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
    return {
        'accessToken': accessToken,
        'refreshToken': refreshToken,
    };
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
        //const userRole = user.roles;
        //console.log(userRole);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("email or password incorrect");
        }


        const tokens = await generateTokens(user)
        return res.status(200).send({tokens , "userId" : user.id,}); //"userRole" : userRole});
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
    //console.log(refreshToken)
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: {'_id': string}) => {
        if (err) {
            return res.sendStatus(401);
        }
        try{
            const userFromDb = await User.findOne({'_id': user._id});
            if (!userFromDb.tokens || !userFromDb.tokens.includes(refreshToken)) {
                userFromDb.tokens = []; //invalidates all user tokens
                await userFromDb.save();
                //return res.sendStatus(401)
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
            //console.log(userFromDb)
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': newRefreshToken  
            });
        }catch (err) {
            res.sendStatus(401).send(err.message);
        }
    });
}

const checkToken = (req:Request, res:Response) => { 
    const {token} = req.body;
    //console.log("from check",token);
    if (!token) {
        return res.status(401).json({message: "No token provided"});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(403).json({message: "Invalid token"});
        }

        return res.status(200).json({ isValidToken: true });
    });   
}

export default {
    googleSignin,
    register,
    login,
    logout,
    refresh,
    generateTokens,
    checkToken
}