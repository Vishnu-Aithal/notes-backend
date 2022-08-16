import { Handler, Router } from "express";
import { User } from "../../Models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";
import { getNow } from "../../Utils/getNow";

export const authRouter = Router();

const loginUser: Handler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw errorMessageWithCode("user not found", 401);
        }

        if (user?.password) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw errorMessageWithCode("wrong password", 401);
            }

            const encodedToken = jwt.sign(
                user._id.toString(),
                process.env.TOKEN_SECRET
            );
            res.json({
                foundUser: { ...user?.toObject(), password: null },
                encodedToken,
            });
        }
    } catch (err) {
        next(err);
    }
};

const addNewUser: Handler = async (req, res, next) => {
    try {
        const { email, password, ...rest } = req.body;
        const hashedpassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedpassword,
            ...rest,
            createdAt: getNow(),
            updatedAt: getNow(),
        });
        const encodedToken = jwt.sign(
            user._id.toString(),
            process.env.TOKEN_SECRET
        );
        await user.save();
        res.status(201).json({ user: { email, ...rest }, encodedToken });
    } catch (error) {
        next(error);
    }
};

authRouter.route("/notes/api/auth/login").post(loginUser);

authRouter.route("/notes/api/auth/signup").post(addNewUser);
