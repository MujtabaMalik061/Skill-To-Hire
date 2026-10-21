import {
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  arrayUnion,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../utils/FirebaseConfig.js";
import { Limit } from "../utils/Constants.js";

const jobsCollection = "Jobs";
const searchCollection = "SearchTokens";

const toSearchTokens = (values) =>
  [
    ...new Set(
      values
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .match(/[a-z0-9+#.-]{2,}/g) || [],
    ),
  ].slice(0, 100);

export const storeSearchToken = async (searchTokens) => {
  if (!searchTokens?.length) return;

  const tokensRef = doc(db, searchCollection, "tokens");

  await setDoc(
    tokensRef,
    {
      tokens: arrayUnion(...searchTokens),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

// export const createJob = async (providerProfile, jobData) => {
//   const jobRef = doc(collection(db, jobsCollection));
//   const job = {
//     ...jobData,
//     jobId: jobRef.id,
//     providerDocId: providerProfile.docId,
//     providerAuthId: providerProfile.authId,
//     companyName: providerProfile.companyName,
//     searchTokens: toSearchTokens([
//       jobData.title,
//       providerProfile.companyName,
//       jobData.location,
//       ...(jobData.skills || []),
//     ]),
//     status: "published",
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//   };

//   await setDoc(jobRef, job);
//   return job;
// };

export const createJob = async (providerProfile, jobData) => {
  const jobRef = doc(collection(db, jobsCollection));

  const searchTokens = toSearchTokens([
    jobData.title,
    providerProfile.companyName,
    jobData.location,
    ...(jobData.skills || []),
  ]);

  const job = {
    ...jobData,
    jobId: jobRef.id,
    providerDocId: providerProfile.docId,
    providerAuthId: providerProfile.authId,
    companyName: providerProfile.companyName,
    searchTokens,
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(jobRef, job);
  await storeSearchToken(searchTokens);
  return job;
};

export const getSearchTokens = async () => {
  try {
    const tokensRef = doc(db, searchCollection, "tokens");
    const snapshot = await getDoc(tokensRef);

    if (!snapshot.exists()) return [];

    return snapshot.data().tokens || [];
  } catch (error) {
    console.error("Error fetching search tokens:", error);
    throw error;
  }
};

// const searchTokens = await getSearchTokens();

// const searchSuggestions = searchTokens
//   .filter((token) =>
//     token.toLowerCase().startsWith(searchInput.trim().toLowerCase()),
//   )
//   .slice(0, 10);

// console.log(searchSuggestions);

export const getJob = async (jobId) => {
  const jobSnapshot = await getDoc(doc(db, jobsCollection, jobId));
  return jobSnapshot.exists() ? jobSnapshot.data() : null;
};

export const subscribeJob = (jobId, onChange, onError) =>
  onSnapshot(
    doc(db, jobsCollection, jobId),
    (jobSnapshot) => {
      onChange(jobSnapshot.exists() ? jobSnapshot.data() : null);
    },
    onError,
  );

const toPage = (snapshot) => ({
  items: snapshot.docs.map((jobDoc) => jobDoc.data()),
  cursor: snapshot.docs.at(-1) || null,
  hasMore: snapshot.docs.length === Limit,
});

export const getPublishedJobsPage = async ({
  employmentType = "all",
  searchTerm = "",
  cursor = null,
} = {}) => {
  const constraints = [
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
  ];

  if (employmentType !== "all") {
    constraints.splice(1, 0, where("employmentType", "==", employmentType));
  }

  const searchToken = searchTerm.toLowerCase().match(/[a-z0-9+#.-]{2,}/)?.[0];

  if (searchToken) {
    constraints.splice(
      1,
      0,
      where("searchTokens", "array-contains", searchToken),
    );
  }

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(Limit));
  return toPage(
    await getDocs(query(collection(db, jobsCollection), ...constraints)),
  );
};

export const getProviderJobsPage = async ({
  providerAuthId,
  cursor = null,
}) => {
  const constraints = [
    where("providerAuthId", "==", providerAuthId),
    orderBy("createdAt", "desc"),
  ];

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(Limit));
  return toPage(
    await getDocs(query(collection(db, jobsCollection), ...constraints)),
  );
};

export const updateJobStatus = async (jobId, status) => {
  await updateDoc(doc(db, jobsCollection, jobId), {
    status,
    updatedAt: serverTimestamp(),
  });
};
