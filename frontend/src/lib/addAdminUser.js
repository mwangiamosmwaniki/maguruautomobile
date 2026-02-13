import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase.js";

/**
 * Add an admin user to Firestore
 * Run this once to create the admin account
 */
export const addAdminUser = async (email, password = "Admin@123") => {
  try {
    const usersCollection = collection(db, "users");
    const userDoc = doc(usersCollection);

    await setDoc(userDoc, {
      id: userDoc.id,
      email: email,
      role: "admin",
      status: "active",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(" Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`UID: ${userDoc.id}`);
    console.log("Password: Admin@123");

    return userDoc.id;
  } catch (error) {
    console.error(" Error creating admin user:", error);
    throw error;
  }
};

/**
 * Usage:
 * import { addAdminUser } from "./lib/firebaseService";
 *
 * // In your component or console:
 * await addAdminUser("admin@maguruauto.com");
 */
