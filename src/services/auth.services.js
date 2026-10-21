import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/FirebaseConfig.js";
import {
  createUserProfile,
  getUserProfileByAuthId,
} from "./user.services.js";

const authProviders = {
  google: () => new GoogleAuthProvider(),
  github: () => new GithubAuthProvider(),
  apple: () => {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    return provider;
  },
};

export const signUpWithEmail = async ({ password, ...profile }) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    profile.email,
    password,
  );
  const displayName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  try {
    await updateProfile(credential.user, { displayName });
    const userProfile = await createUserProfile(credential.user, profile);

    return { user: credential.user, profile: userProfile };
  } catch (error) {
    await deleteUser(credential.user).catch(() => undefined);
    throw error;
  }
};

export const signInWithEmail = async ({ email, password }) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfileByAuthId(credential.user.uid);

  if (!profile) {
    await firebaseSignOut(auth);
    throw new Error("Your account profile is missing. Please contact support.");
  }

  return { user: credential.user, profile };
};

export const signInWithProvider = async (providerName) => {
  const createProvider = authProviders[providerName];

  if (!createProvider) {
    throw new Error("This sign-in provider is not supported.");
  }

  const credential = await signInWithPopup(auth, createProvider());
  const profile = await getUserProfileByAuthId(credential.user.uid);

  if (!profile) {
    await firebaseSignOut(auth);
    throw new Error("No profile was found. Choose Sign up to create your account.");
  }

  return { user: credential.user, profile };
};

export const signUpWithProvider = async (providerName, profileData) => {
  const createProvider = authProviders[providerName];

  if (!createProvider) {
    throw new Error("This sign-in provider is not supported.");
  }

  const credential = await signInWithPopup(auth, createProvider());
  const existingProfile = await getUserProfileByAuthId(credential.user.uid);

  if (existingProfile) {
    return { user: credential.user, profile: existingProfile };
  }

  try {
    const profile = await createUserProfile(credential.user, {
      ...profileData,
      firstName:
        profileData.firstName ||
        credential.user.displayName?.split(" ")[0] ||
        "",
      lastName:
        profileData.lastName ||
        credential.user.displayName?.split(" ").slice(1).join(" ") ||
        "",
    });

    return { user: credential.user, profile };
  } catch (error) {
    await firebaseSignOut(auth).catch(() => undefined);
    throw error;
  }
};

export const requestPasswordReset = (email) =>
  sendPasswordResetEmail(auth, email);

export const signOut = () => firebaseSignOut(auth);
