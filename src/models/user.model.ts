import { db } from "../config/firebase.config"
import { compareValue, hashValue } from "../util/bcrypt"


export interface User {
    email: string,
    password: string,
    verified: boolean,
    createdAt: Date,
    updatedAt: Date
}

// Create new user
// Omit: create new type from existing type by removing properties from it
export async function createUser(userData: Omit<User, "createdAt" | "updatedAt">): Promise<{ id: string, user: User }> {
    const hashedPassword = await hashValue(userData.password);
    const timestamp = new Date();

    const newUser: User = {
        ...userData,
        password: hashedPassword,
        verified: userData.verified ?? false,
        createdAt: timestamp,
        updatedAt: timestamp
    }

    // Saving to firestore
    const newDoc = await db.collection("users").add(newUser);
    return { id: newDoc.id, user: newUser };
}

// Get user by ID
export async function getUserById(id: string): Promise<{ id: string, user: User } | null> {
    const user = await db.collection("users").doc(id).get();

    if (!user.exists) return null;

    return { id: user.id, user: user.data() as User };
}
// Get user by email
// Partial: not all properties are applied
export async function getUserByEmail(email: string): Promise<{ id: string, user: User } | null> {
    const user = await db.collection("users")
        .where("emails", "==", email)
        .limit(1)
        .get();

    if (!user.empty) return null;

    const userDoc = user.docs[0];
    return { id: userDoc.id, user: userDoc.data() as User };
}

// Update a user
export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
    const update = { ...updates };

    if (update.password) {
        update.password = await hashValue(update.password)
    }

    update.updatedAt = new Date();

    await db.collection("users").doc(id).update(update);
}

// Compare password helper
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compareValue(password, hashedPassword);
}

// User withour password
export function omitPassword(user:User): Omit<User, "password"> {
    const {password, ...userWithoutPassword} = user;

    return userWithoutPassword;
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