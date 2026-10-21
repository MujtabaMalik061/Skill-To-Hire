import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { auth, db } from "../utils/FirebaseConfig.js";
import { sendPush } from "../utils/Push.Helper.js";
import { Limit } from "../utils/Constants.js";

const notificationsCollection = "Notifications";

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const sendExternalNotification = async (recipient, { title, body, link }) => {
  const tasks = [];

  if (recipient.fcmTokens?.length) {
    tasks.push(
      sendPush({
        type: "push",
        title,
        body,
        fcmTokens: recipient.fcmTokens,
        link,
      }),
    );
  }

  if (recipient.email) {
    tasks.push(
      sendPush({
        type: "mail",
        from: "Skill To Hire",
        mails: [recipient.email],
        subject: title,
        htmlContent: `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p><p><a href="${escapeHtml(window.location.origin + link)}">Open Skill To Hire</a></p>`,
      }),
    );
  }

  const outcomes = await Promise.allSettled(tasks);
  outcomes
    .filter((outcome) => outcome.status === "rejected")
    .forEach((outcome) => {
      console.error("External notification could not be sent:", outcome.reason);
    });
};

export const createNotification = async (
  senderProfile,
  recipientProfile,
  { type, title, body, link, applicationId = "" },
) => {
  await addDoc(collection(db, notificationsCollection), {
    recipientDocId: recipientProfile.docId,
    senderAuthId: auth.currentUser?.uid || senderProfile.authId,
    type,
    title,
    body,
    link,
    applicationId,
    read: false,
    createdAt: serverTimestamp(),
  });

  await sendExternalNotification(recipientProfile, { title, body, link });
};

const notificationQuery = (recipientDocId, cursor = null) => {
  const constraints = [
    where("recipientDocId", "==", recipientDocId),
    orderBy("createdAt", "desc"),
  ];

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(Limit));
  return query(collection(db, notificationsCollection), ...constraints);
};

const toPage = (snapshot) => ({
  items: snapshot.docs.map((notificationDoc) => ({
    ...notificationDoc.data(),
    id: notificationDoc.id,
  })),
  cursor: snapshot.docs.at(-1) || null,
  hasMore: snapshot.docs.length === Limit,
});

export const getNotificationsPage = async ({ recipientDocId, cursor = null }) =>
  toPage(await getDocs(notificationQuery(recipientDocId, cursor)));

export const subscribeNotifications = (recipientDocId, onChange, onError) => {
  const notificationsQuery = query(
    collection(db, notificationsCollection),
    where("recipientDocId", "==", recipientDocId),
    orderBy("createdAt", "desc"),
    limit(Limit),
  );

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      onChange(toPage(snapshot).items);
    },
    onError,
  );
};

export const markNotificationRead = async (notificationId) => {
  await updateDoc(doc(db, notificationsCollection, notificationId), {
    read: true,
  });
};
