import { supabase } from "../config/supabase.config"
import { compareValue, hashValue } from "../utils/bcrypt"
import createHttpError from "http-errors";
import { INTERNAL_SERVER_ERROR } from "../config/http";


export interface User {
    id: string;
    email: string;
    password: string;
    verified: boolean;
    created_at: string;
    updated_at: string;
}

// Create new user
// Omit: create new type from existing type by removing properties from it
export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<{ id: string, user: User }> {
    try {
        const hashedPassword = await hashValue(userData.password);
        const timestamp = new Date().toISOString();

        const newUser = {
            ...userData,
            password: hashedPassword,
            verified: userData.verified ?? false,
            created_at: timestamp,
            updated_at: timestamp
        };

        const { data, error } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

        
        if (!data) {
            throw createHttpError(INTERNAL_SERVER_ERROR, 'Failed to create user: No data returned');
        }

        return { id: data.id, user: data };
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to create user: ${error}`);
    }
}

// Get user by ID
export async function getUserById(id: string): Promise<{ id: string, user: User } | null> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        
        if (!data) return null;

        return { id: data.id, user: data };
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to get user by ID: ${error}`);
    }
}

// Get user by email
// Partial: not all properties are applied
export async function getUserByEmail(email: string): Promise<{ id: string, user: User } | null> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!data) return null;

        return { id: data.id, user: data };
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to get user by email: ${error}`);
    }
}

// Update a user
export async function updateUser(id: string, updates: Partial<Omit<User, "id" | "created_at">>): Promise<void> {
    try {
        const update = { ...updates };

        if (update.password) {
            update.password = await hashValue(update.password);
        }

        update.updated_at = new Date().toISOString();

        const { error } = await supabase
            .from('users')
            .update(update)
            .eq('id', id);

    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to update user: ${error}`);
    }
}

// Compare password helper
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await compareValue(password, hashedPassword);
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to compare passwords: ${error}`);
    }
}

// User withour password
export function omitPassword(user: User): Omit<User, "password"> {
    try {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to omit password: ${error}`);
    }
}

const UserModel = {
    createUser,
    updateUser,
    getUserByEmail,
    getUserById,
    comparePassword,
    omitPassword
}

export default UserModel;