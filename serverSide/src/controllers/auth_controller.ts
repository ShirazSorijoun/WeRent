import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
   res.status(400).send("unimplemented-register");
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