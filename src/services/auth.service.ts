import createHttpError from "http-errors";
import { getUserByEmail, createUser } from "../models";
import { CONFLICT } from "../config/http";
import { createVerificationCode } from "../models/verificationCode.model";
import VerificationCodeType from "../config/verificationCode.config";

export type CreateAccountParams = {
    email: string,
    password: string,
    userAgent?: string
}

export const createAccount = async (data: CreateAccountParams) => {
    // Verify existing account
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) throw createHttpError(CONFLICT, "User already exist");

    // Create user
    const result = await createUser({
        email: data.email,
        password: data.password,
        verified: false,
    });

    // Create verification code
    const verificationCode = await createVerificationCode(
        result.id,
        VerificationCodeType.EmailVerification,
        Date.now() + 60 * 60 * 1000 // one hour from created time
    );

    // Send verification email

    // Create session
    
    // Access token and refresh token
    // Return user token
}