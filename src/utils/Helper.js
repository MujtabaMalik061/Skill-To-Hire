import { doc, getDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig.js";

const idCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const idLength = 14;

const createRandomId = () => {
  const randomValues = new Uint8Array(idLength);
  globalThis.crypto.getRandomValues(randomValues);

  return Array.from(
    randomValues,
    (value) => idCharacters[value % idCharacters.length],
  ).join("");
};

export const generateCustomId = async (collectionName) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const customId = createRandomId();
    const customDoc = await getDoc(doc(db, collectionName, customId));

    if (!customDoc.exists()) {
      return customId;
    }
  }

  throw new Error(`Could not create a unique ID for ${collectionName}.`);
};
