import { z } from "zod";
import { Request, Response } from "express";
import catchError from "../utils/catchError";
import { createAccount } from "../services";

const registerSchema = z.object({
    email: z.string().email().min(5).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional()
}).refine(
    (data) => data.password === data.confirmPassword, {
    message: "Password not match",
    path: ["confirmPassword"]
});

export const registerHandler = catchError(async (req: Request, res: Response) => {
    // Validate request
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"]
    });

    // Call service
    const result = await createAccount(request);

    // Return response
    res.json(result);
});