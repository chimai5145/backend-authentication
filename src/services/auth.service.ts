import createHttpError from "http-errors";
import UserModel from "../models/user.model"
import { CONFLICT } from "../config/http";

export type CreateAccountParams = {
    email: string,
    password: string,
    userAgent?: string
}

export const createAccount = async (data: CreateAccountParams) => {
    // Verify existing account
    const existingUser = await UserModel.getUserByEmail(data.email);
    if (existingUser) throw createHttpError(CONFLICT, "User already exist");

    // If not create user
    const newUser = await UserModel.createUser({
        email: data.email,
        password: data.password,
        verified: false,
    });
    
    // Create verification code
    // Send verifycation email
    // Create session
    // Acsess token and refresh token
    // Return user token
}