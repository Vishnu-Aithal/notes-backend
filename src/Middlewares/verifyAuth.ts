import { Handler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../Models/User";
import { errorMessageWithCode } from "../Utils/errorMessageWithCode";

export const verifyAuth: Handler = async (req, _res, next) => {
    try {
        if (!req.headers.authorization) {
            throw errorMessageWithCode(
                "Unauthorized, Requires Authorization Headers",
                401
            );
        }
        const token = req.headers.authorization;
        let userId;
        try {
            userId = jwt.verify(token as string, process.env.TOKEN_SECRET);
        } catch (err) {
            throw errorMessageWithCode(
                "Unauthorized, Invalid authorization token",
                401
            );
        }
        const user = await User.findById(userId);
        if (!user) {
            throw errorMessageWithCode("Token user not found", 404);
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};
