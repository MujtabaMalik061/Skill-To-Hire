import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/FirebaseConfig.js";
import { generateCustomId } from "../utils/Helper.js";

const usersCollection = "Users";
const userIndexCollection = "UserIndex";
const privateUsersCollection = "UserPrivate";

export const createUserProfile = async (authUser, profileData) => {
  const indexRef = doc(db, userIndexCollection, authUser.uid);
  const docId = await generateCustomId(usersCollection);
  const profileRef = doc(db, usersCollection, docId);
  const privateRef = doc(db, privateUsersCollection, docId);
  const { email: profileEmail, ...publicProfileData } = profileData;
  const userProfile = {
    ...publicProfileData,
    docId,
    authId: authUser.uid,
    role: profileData.role,
    hasPushToken: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const privateProfile = {
    docId,
    authId: authUser.uid,
    email: authUser.email || profileEmail || "",
    fcmTokens: [],
    createdAt: serverTimestamp(),
  };

  return runTransaction(db, async (transaction) => {
    const existingIndex = await transaction.get(indexRef);

    if (existingIndex.exists()) {
      const existingProfile = await transaction.get(
        doc(db, usersCollection, existingIndex.data().docId),
      );

      if (!existingProfile.exists()) {
        throw new Error("Your account profile could not be found.");
      }

      return existingProfile.data();
    }

    const idCollision = await transaction.get(profileRef);
    const privateCollision = await transaction.get(privateRef);

    if (idCollision.exists() || privateCollision.exists()) {
      throw new Error("This profile ID is already in use. Please try again.");
    }

    transaction.set(profileRef, userProfile);
    transaction.set(privateRef, privateProfile);
    transaction.set(indexRef, {
      docId,
      authId: authUser.uid,
      createdAt: serverTimestamp(),
    });

    return userProfile;
  });
};

export const getUserProfileByAuthId = async (authId) => {
  const indexSnapshot = await getDoc(doc(db, userIndexCollection, authId));

  if (!indexSnapshot.exists()) {
    return null;
  }

  const profileSnapshot = await getDoc(
    doc(db, usersCollection, indexSnapshot.data().docId),
  );

  return profileSnapshot.exists() ? profileSnapshot.data() : null;
};

export const getUserProfileByDocId = async (docId) => {
  const profileSnapshot = await getDoc(doc(db, usersCollection, docId));
  return profileSnapshot.exists() ? profileSnapshot.data() : null;
};

export const getUserContactProfileByDocId = async (docId) => {
  const [profileSnapshot, privateSnapshot] = await Promise.all([
    getDoc(doc(db, usersCollection, docId)),
    getDoc(doc(db, privateUsersCollection, docId)),
  ]);

  if (!profileSnapshot.exists() || !privateSnapshot.exists()) {
    return null;
  }

  return {
    ...profileSnapshot.data(),
    ...privateSnapshot.data(),
  };
};

export const subscribeUserProfile = (authId, onChange, onError) => {
  const indexRef = doc(db, userIndexCollection, authId);
  let unsubscribeProfile = () => {};

  const unsubscribeIndex = onSnapshot(
    indexRef,
    (indexSnapshot) => {
      unsubscribeProfile();

      if (!indexSnapshot.exists()) {
        onChange(null);
        return;
      }

      const profileRef = doc(
        db,
        usersCollection,
        indexSnapshot.data().docId,
      );

      unsubscribeProfile = onSnapshot(
        profileRef,
        (profileSnapshot) => {
          onChange(
            profileSnapshot.exists() ? profileSnapshot.data() : null,
          );
        },
        onError,
      );
    },
    onError,
  );

  return () => {
    unsubscribeIndex();
    unsubscribeProfile();
  };
};

export const updateUserProfile = async (docId, changes) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "role",
    "headline",
    "skills",
    "employmentStatus",
    "universityName",
    "companyName",
    "companyWebsite",
    "bio",
  ];
  const safeChanges = Object.fromEntries(
    Object.entries(changes).filter(([key]) => allowedFields.includes(key)),
  );

  if (
    Object.hasOwn(safeChanges, "role") &&
    !["student", "employee", "jobProvider"].includes(safeChanges.role)
  ) {
    throw new Error("Choose a valid account type.");
  }

  await updateDoc(doc(db, usersCollection, docId), {
    ...safeChanges,
    updatedAt: serverTimestamp(),
  });
};

export const saveFcmToken = async (docId, token) => {
  await Promise.all([
    updateDoc(doc(db, privateUsersCollection, docId), {
      fcmTokens: arrayUnion(token),
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, usersCollection, docId), {
      hasPushToken: true,
      updatedAt: serverTimestamp(),
    }),
  ]);
};
