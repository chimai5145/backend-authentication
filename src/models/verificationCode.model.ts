import createHttpError from "http-errors";
import { supabase } from "../config/supabase.config";
import VerificationCodeType from "../config/verificationCode.config";
import { INTERNAL_SERVER_ERROR } from "../config/http";

export interface VerificationCode {
    id: string;
    user_id: string;
    type: VerificationCodeType;
    created_at: string;
    expired_at: string;
}

// Create a verification code
export const createVerificationCode = async (
    userId: string,
    type: VerificationCodeType,
    expireMinutes: number = 30
): Promise<string> => {
    try {
        const now = new Date();
        const expireTime = new Date(now.getTime() + expireMinutes * 60000);

        const verificationCode = {
            user_id: userId,
            type,
            created_at: now.toISOString(),
            expired_at: expireTime.toISOString()
        };

        // supabase returns an object with data and error
        const { data, error } = await supabase
            .from('verification_codes')
            .insert(verificationCode)
            .select()
            .single();

        
        return data.id;
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to create verification code: ${error}`);
    }
};

// Get verification code by ID
export const getById = async (codeId: string): Promise<VerificationCode | null> => {
    try {
        const { data, error } = await supabase
            .from('verification_codes') // table name
            .select('*') // select all columns
            .eq('id', codeId) // where id equals codeId
            .single(); // return a single object

        
        return data;
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to get verification code: ${error}`);
    }
};

// Get all verification codes for a user
// firebase: return an objecct where each key = record id
// supabase: return an array of records
export const getAllVerificationCodes = async (userId: string, type: VerificationCodeType): Promise<VerificationCode[]> => {
    try {
        const { data, error } = await supabase
            .from('verification_codes') // table name
            .select('*') // select all columns
            .eq('user_id', userId) // where user_id equals userId
            .eq('type', type); // where type equals type

        
        return data || [];
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to get verification codes: ${error}`);
    }
};

// Check if valid
export const validateVerificationCode = async (codeId: string): Promise<boolean> => {
    try {
        const code = await getById(codeId);
        if (!code) return false;

        const expireTime = new Date(code.expired_at);
        return expireTime > new Date();
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to validate verification code: ${error}`);
    }
};

// Delete one
export const removeVerificationCode = async (codeId: string): Promise<void> => {
    try {
        // destructure error from the response
        const { error } = await supabase
            .from('verification_codes') // table name
            .delete() // specify delete the record
            .eq('id', codeId); // filter to id equals codeId

    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to remove code: ${error}`);
    }
};

// Delete all expired
export const removeAllExpired = async (): Promise<void> => {
    try {
        const now = new Date().toISOString();
        const { error } = await supabase
            .from('verification_codes')
            .delete()
            .lt('expired_at', now);

        
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Failed to remove expired codes: ${error}`);
    }
};

export default {
    createVerificationCode,
    getById,
    getAllVerificationCodes,
    validateVerificationCode,
    removeVerificationCode,
    removeAllExpired
};