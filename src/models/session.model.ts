import createHttpError from "http-errors";
import { supabase } from "../config/supabase.config";
import { INTERNAL_SERVER_ERROR } from "../config/http";



export interface Session {
    id: string;
    user_id: string;
    user_agent?: string; // when user login from different device
    ip_address?: string; // when user login from different ip address
    is_valid: boolean; // if the session is valid
    created_at: string;
    expires_at: string;
}

export const createSession = async (
    userId: string,
    user_agent?: string,
    ip_address?: string): Promise<Session> => {
    try {
        // Get time
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 60 * 60 * 24); // 30 days

        // access table
        const { data, error } = await supabase
            .from("session")
            .insert({
                user_id: userId,
                user_agent: user_agent, // when user login from different device
                ip_address: ip_address, // when user login from different ip address
                is_valid: true, // if the session is valid
                created_at: now.toISOString(),
                expires_at: expiresAt.toISOString()
            })
            .select()
            .single();

        return data;
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to create session: ${error}`);
    }
}

export const getSessionById = async (id: string): Promise<Session | null> => {
    try {
        const { data, error } = await supabase
            .from(`session`)
            .select(`*`)
            .eq(`id`, id)
            .single()
        return data;
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to get session by id: ${error}`);
    }
}

export const getUserSessions = async (userId: string): Promise<Session[]> => {
    try {
        const { data, error } = await supabase
            .from(`session`)
            .select(`*`)
            .eq(`user_id`, userId)
            .eq(`is_valid`, true)
            .gt(`expires_at`, new Date().toISOString())

        return data || [];
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail to get user session: ${error}`);
    }
}

export const invalidateSession = async (id: string) => {
    try {
        const { error } = await supabase
        .from(`session`)
        .update({is_valid: false})
        .eq(`id`, id)
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail invalidate session: ${error}`);
    }
}

export const deleteExpiredSessions = async () => {
    try {
        const {error} = await supabase
        .from(`session`)
        .delete()
        .lt(`expires_at`, new Date().toISOString())
    } catch (error) {
        throw createHttpError(INTERNAL_SERVER_ERROR, `Fail delete expired session: ${error}`);
    }
}
const SessionModel = {
    createSession,
    getSessionById,
    getUserSessions,
    invalidateSession,
    deleteExpiredSessions
};

export default SessionModel;