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
// Delete