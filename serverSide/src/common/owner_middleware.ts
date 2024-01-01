import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/user_model';


interface CustomRequest extends Request {
    user?: {_id: string};
}

const ownerMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        return res.status(401).send("missing authorization header");
    }
    const token = /*authHeader &&*/ authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send("missing authorization token");
    }

    const decode = jwt.decode(token);
    const userId= decode._id;


    const user = await User.findOne({ _id : userId });
    if(user.roles === UserRole.Owner)
    {
        next();
    }
    else{
        return res.status(401).send("Not Owner");
    }
    
}


export default ownerMiddleware;