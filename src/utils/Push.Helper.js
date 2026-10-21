import { sendMail, sendNotification } from "dev-push-notification";

const apiKey = import.meta.env.VITE_Push_Notification;

export const sendPush = async ({
  type,
  title,
  body,
  fcmTokens,
  from,
  mails,
  subject,
  htmlContent,
  icon,
  link,
}) => {
  if (!apiKey) {
    throw new Error("VITE_Push_Notification is not configured.");
  }

  if (type === "mail") {
    return sendMail({ apiKey, from, mails, subject, htmlContent });
  }

  if (type === "push") {
    return sendNotification({
      apiKey,
      title,
      body,
      fcmTokens,
      icon,
      link,
    });
  }

  throw new Error('Invalid type. Use "mail" or "push".');
};
