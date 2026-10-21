import { useEffect } from "react";
import { initMessaging, onMessageListener } from "dev-push-notification";
import PushTest from "./pages/PushTest.jsx";

const App = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_Push_Notification;
    if (!apiKey) {
      console.error("VITE_Push_Notification is not configured.");
      return undefined;
    }

    initMessaging(apiKey).catch((error) => {
      console.error("Push messaging initialization failed:", error);
    });

    const unsubscribe = onMessageListener(async (payload) => {
      try {
        console.log("Foreground notification received:", payload);

        const notification = payload.notification || payload.data || {};
        const title = notification.title || "Notification";
        const body = notification.body || "";
        const image = notification.image || notification.icon || "";
        const clickUrl = payload.data?.clickUrl || payload.data?.link || "/";

        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          icon: image,
          data: { clickUrl },
        });
      } catch (error) {
        console.error("Could not display foreground notification:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  if (window.location.pathname === "/test") {
    return <PushTest />;
  }

  return (
    <main className="home-page">
      <p>Skill To Hire</p>
      <a href="/test">Open notification test page</a>
    </main>
  );
};

export default App;
