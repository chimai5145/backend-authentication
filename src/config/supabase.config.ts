import "dotenv/config";
import { createClient } from '@supabase/supabase-js';
import createHttpError from "http-errors";
import { INTERNAL_SERVER_ERROR } from "./http";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw createHttpError(INTERNAL_SERVER_ERROR, 'Missing Supabase environment variables');
    process.exit(1);
}

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
); 