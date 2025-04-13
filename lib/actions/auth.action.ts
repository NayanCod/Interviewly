"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { toast } from "sonner";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email, subscription } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }
    await db.collection("users").doc(uid).set({
      name,
      email,
      subscription,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in!",
    };
  } catch (error: any) {
    console.error("Error creating an user", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    return {
      success: false,
      message: "Failed to create an account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      };
    }

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.error("Error signing in", error);

    if (error.code === "auth/invalid-credential") {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    return {
      success: false,
      message: "Failed to log into an account",
    };
  }
}

export async function googleSignIn(params: GoogleSignInParams) {
  const { email, idToken, name, photoURL } = params;

  try {
    // Check if the user already exists in the database
    // const userRecord = await db.collection("users").where("email", "==", email).get();
    const decodedToken = await auth.verifyIdToken(idToken);
const uid = decodedToken.uid;

// Check if the user exists in the database
const userRecord = await db.collection("users").doc(uid).get();

    if (!userRecord.exists) {
      // If the user does not exist, create a new user in the database
      const newUser = {
        name,
        email,
        photoURL,
        subscription: false, // Default subscription status
        createdAt: new Date().toISOString(),
      };

      await db.collection("users").doc(uid).set(newUser);
    }

    // Set the session cookie for the user
    await setSessionCookie(idToken);

    // console.log("setup: ", setup);
    

    return {
      success: true,
      message: "Signed in with Google successfully!",
    };
  } catch (error: any) {
    console.error("Error signing in with Google", error);

    if (error.code === "auth/invalid-credential") {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    return {
      success: false,
      message: "Failed to sign in with Google",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value || null;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      return null;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    toast.error("Session expired. Please sign in again.");
    console.error("Error getting current user", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function logout() {
  const cookieStore = await cookies();
  
  const allCookies = cookieStore.getAll();

  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}