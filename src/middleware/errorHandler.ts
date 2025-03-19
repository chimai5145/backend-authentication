import { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../config/http";
import { ZodError, z } from "zod";
import { Response, NextFunction } from "express-serve-static-core";

const handleZodError = (res: Response, err: ZodError, next: NextFunction) => {
    const errors = err.issues.map((error) => ({
        path: error.path.join('.'),
        message: error.message
    }))
    next(createHttpError(BAD_REQUEST, {
        message: err.message,
        errors
    }))
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(`PATH: ${req.path}`, err);

    if (err instanceof z.ZodError) {
        return handleZodError(res, err, next);
    }

    next(createHttpError(INTERNAL_SERVER_ERROR, "Internal server error"));
}

export default errorHandler;