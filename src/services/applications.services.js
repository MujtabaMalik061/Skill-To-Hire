import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  writeBatch,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../utils/FirebaseConfig.js";
import { Limit } from "../utils/Constants.js";
import { getJob } from "./jobs.services.js";

const applicationsCollection = "Applications";

export const applyForJob = async (jobId, candidateProfile, applicationData) => {
  const job = await getJob(jobId);

  if (!job || job.status !== "published") {
    throw new Error("This job is no longer accepting applications.");
  }

  const applicationId = `${jobId}_${candidateProfile.docId}`;
  const applicationRef = doc(db, applicationsCollection, applicationId);
  const existingApplication = await getDoc(applicationRef);

  if (existingApplication.exists()) {
    throw new Error("You have already applied for this job.");
  }

  const application = {
    ...applicationData,
    applicationId,
    jobId,
    jobTitle: job.title,
    companyName: job.companyName,
    providerDocId: job.providerDocId,
    providerAuthId: job.providerAuthId,
    candidateDocId: candidateProfile.docId,
    candidateAuthId: candidateProfile.authId,
    candidateName: `${candidateProfile.firstName} ${candidateProfile.lastName}`.trim(),
    status: "submitted",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const connectionId = `${candidateProfile.docId}_${job.providerDocId}`;
  const connectionRef = doc(db, "UserConnections", connectionId);
  const batch = writeBatch(db);

  batch.set(applicationRef, application);
  batch.set(connectionRef, {
    candidateDocId: candidateProfile.docId,
    candidateAuthId: candidateProfile.authId,
    providerDocId: job.providerDocId,
    providerAuthId: job.providerAuthId,
    jobId,
    createdAt: serverTimestamp(),
  });

  await batch.commit();
  return { ...application, job };
};

const toPage = (snapshot) => ({
  items: snapshot.docs.map((applicationDoc) => applicationDoc.data()),
  cursor: snapshot.docs.at(-1) || null,
  hasMore: snapshot.docs.length === Limit,
});

const getApplicationsPage = async (field, value, cursor = null) => {
  const constraints = [where(field, "==", value), orderBy("createdAt", "desc")];

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(Limit));
  return toPage(
    await getDocs(query(collection(db, applicationsCollection), ...constraints)),
  );
};

export const getCandidateApplicationsPage = ({ candidateAuthId, cursor }) =>
  getApplicationsPage("candidateAuthId", candidateAuthId, cursor);

export const getProviderApplicationsPage = ({ providerAuthId, cursor }) =>
  getApplicationsPage("providerAuthId", providerAuthId, cursor);

export const updateApplicationStatus = async (applicationId, status) => {
  await updateDoc(doc(db, applicationsCollection, applicationId), {
    status,
    updatedAt: serverTimestamp(),
  });
};
