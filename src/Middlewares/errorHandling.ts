import { ErrorRequestHandler } from "express";

export const errorHandling: ErrorRequestHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? "Internal Server Error" : err.message;
    console.log(err);
    res.statusMessage = message;
    res.status(statusCode).json({ message });
};
