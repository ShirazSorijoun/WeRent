import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user: {_id: string};
}

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        return res.status(401).send("missing authorization header");
    }
    const token = /*authHeader &&*/ authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send("missing authorization token");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err);
        if (err) {
            return res.status(401).send(err.message);
        }
        req.user = user as {_id: string};
        next();
    });
}


export default authMiddleware;