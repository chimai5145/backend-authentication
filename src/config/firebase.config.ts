import "dotenv/config";
import admin from "firebase-admin";
import createHttpError from "http-errors";
import { INTERNAL_SERVER_ERROR } from "./http";

// Initialize database
try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

} catch (error) {
    throw createHttpError(INTERNAL_SERVER_ERROR, 'Failed to initialize Firebase Admin SDK');
    process.exit(1);
}

// const getEnv = (key: string, defaultValue?: string): string => {
//     const value = process.env[key] || defaultValue;
//   if (value === undefined) {
//     throw createHttpError(500, Missing string environment variable for ${key}`);
//   }
//   return value;
// }

export const rtdb = admin.database();
export const db = admin.firestore();
export const auth = admin.auth();

