import createHttpError from "http-errors";
import { rtdb } from "../config/firebase.config";
import VerificationCodeType from "../config/verificationCode.config";
import { INTERNAL_SERVER_ERROR } from "../config/http";


export interface VerificationCode {
    userId: string,
    type: VerificationCodeType,
    createdAt: string,
    expiredAt: string
}

// Create a verifycation code
export const create = async (
    userId: string,
    type: VerificationCodeType,
    expireMinutes: number = 30)
    : Promise<string> => {
    try {
        const now = new Date();
        const expireTime = new Date(now.getTime() + expireMinutes * 60000)

        const verificationCode: VerificationCode = {
            userId,
            type,
            createdAt: now.toISOString(),
            expiredAt: expireTime.toISOString()
        }

        // Generate unique key
        // push() generate unique key base on timestamp and random value
        const codeRef = rtdb.ref("verification_codes").push();
        const codeId = codeRef.key || `manual_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        await codeRef.set(verificationCode)
        return codeId
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to created verification code: ${error}`)
    }
}

// Get verifycation code by ID
export const getById = async (userId: string): Promise<VerificationCode | null> => {
    try {
        const snapshot = await rtdb.ref(`verification_codes/${userId}`).once(`value`)

        if (!snapshot.exists) return null;

        return snapshot.val() as VerificationCode;
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to get verification code: ${error}`)
    }
}

// Get all verification code
export const getAll = async (userId: string, type: VerificationCodeType): Promise<{ [key: string]: VerificationCode }> => {
    try {
        const snapshot = await rtdb.ref(`verification_codes/${userId}`)
            .orderByChild("userId")
            .equalTo(userId)
            .once("value")

        if (!snapshot.exists) return {};

        const verificationCodes = snapshot.val();

        const result: { [key: string]: VerificationCode } = {};
        Object.keys(verificationCodes).forEach(key => {
            if (verificationCodes[key].type === type) {
                result[key] = verificationCodes[key];
            }
        })
        return result;
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to get verification codes: ${error}`)
    }
}

// Check if valid
export const validate = async (codeId: string): Promise<boolean> => {
    try {
        const code = await getById(codeId);

        if (!code) return false;

        const expireTime = new Date(code.expiredAt);
        return expireTime > new Date;

    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to validate validation code: ${error}`);
    }
}
// Delete one
export const remove = async (codeId: string): Promise<void> => {
    try {
        await rtdb.ref(`verification_codes/${codeId}`).remove();
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to remove code: ${error}`);
    }
}
// Delete all
export const removeAllExpired = async (): Promise<void> => {
    try {
        // Get the time and retrive the codes
        const now = new Date().toISOString();
        const snapshot = await rtdb.ref(`verification_codes`).once("value");

        if (!snapshot.exists()) return;

        // Process the code
        // Create an objects to create all the paths
        const codes = snapshot.val();
        const updates: { [path: string]: null } = {};

        // Loop through the verification codes
        Object.keys(codes).forEach(key => {
            if (codes[key].expiredAt < now) {
                updates[`verification_codes/${key}`] = null;
            }
        })

        // Bulk updates
        if (Object.keys(updates).length > 0) {
            await rtdb.ref().update(updates);
        }
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to remove expired code: ${error}`);
    }
}

export default {
    create,
    getById,
    getAll,
    validate,
    remove,
    removeAllExpired
}