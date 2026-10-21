import { useEffect } from "react";
import {
  initMessaging,
  onMessageListener,
} from "dev-push-notification";
import { Toaster } from "sonner";
import { AuthProvider } from "./hooks/auth.hook.jsx";
import AppRoutes from "./routes/App.routes.jsx";

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

  useEffect(() => {
    const glow = document.querySelector(".ambient-blue-glow");

    if (!glow || !window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    let frameId;
    let currentX = window.innerWidth * 0.12;
    let currentY = window.innerHeight * 0.1;
    let targetX = currentX;
    let targetY = currentY;

    const animateGlow = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      glow.style.setProperty("--glow-x", `${currentX}px`);
      glow.style.setProperty("--glow-y", `${currentY}px`);
      frameId = window.requestAnimationFrame(animateGlow);
    };

    const handlePointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add("is-following");
    };

    frameId = window.requestAnimationFrame(animateGlow);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <AuthProvider>
      <div className="ambient-blue-glow" aria-hidden="true" />
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
