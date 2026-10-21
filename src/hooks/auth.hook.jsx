import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig.js";
import { subscribeUserProfile } from "../services/user.services.js";
import { getSearchTokens } from "../services/jobs.services.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndStoreSearchTokens = async () => {
    try {
      const searchTokens = await getSearchTokens();

      localStorage.setItem("searchTokens", JSON.stringify(searchTokens));

      return searchTokens;
    } catch (error) {
      console.error("Failed to fetch search tokens:", error);
      return [];
    }
  };

  const getCachedSearchTokens = useCallback((searchInput = "") => {
    try {
      const cachedTokens = JSON.parse(
        localStorage.getItem("searchTokens") || "[]",
      );

      const searchTerm = searchInput.trim().toLowerCase();

      if (!searchTerm) return [];

      return cachedTokens
        .filter(
          (token) =>
            typeof token === "string" &&
            token.toLowerCase().startsWith(searchTerm),
        )
        .slice(0, 10);
    } catch (error) {
      console.error("Failed to read cached search tokens:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (currentUser) => {
        unsubscribeProfile();
        setUser(currentUser);

        if (!currentUser) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        unsubscribeProfile = subscribeUserProfile(
          currentUser.uid,
          (currentProfile) => {
            setProfile(currentProfile);
            setIsLoading(false);
          },
          (error) => {
            console.error("Could not load the user profile:", error);
            setProfile(null);
            setIsLoading(false);
          },
        );
      },
      (error) => {
        console.error("Firebase auth state check failed:", error);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      },
    );

    fetchAndStoreSearchTokens();
    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const value = useMemo(
    () => ({ user, profile, isLoading, getCachedSearchTokens }),
    [user, profile, isLoading, getCachedSearchTokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};

export default useAuth;
