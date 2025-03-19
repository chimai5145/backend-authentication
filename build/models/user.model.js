"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
const firebase_config_1 = require("../config/firebase.config");
const bcrypt_1 = require("../util/bcrypt");
// Create new user
// Omit: create new type from existing type by removing properties from it
async function createUser(userData) {
    const hashedPassword = await (0, bcrypt_1.hashValue)(userData.password);
    const timestamp = new Date();
    const newUser = {
        ...userData,
        password: hashedPassword,
        verified: userData.verified ?? false,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    // Saving to firestore
    const newDoc = await firebase_config_1.db.collection("users").add(newUser);
    return { id: newDoc.id, user: newUser };
}
// Get user by ID
async function getUserById(id) {
    const user = await firebase_config_1.db.collection("users").doc(id).get();
    if (!user.exists)
        return null;
    return { id: user.id, user: user.data() };
}
// Get user by email
async function getUserByEmail(email) {
    const user = await firebase_config_1.db.collection("users")
        .where("emails", "==", email)
        .limit(1)
        .get();
    if (!user.empty)
        return null;
    const userDoc = user.docs[0];
    return { id: userDoc.id, user: userDoc.data() };
}
// Update a user
// Partial: not all properties are applied
// Compare password helper
