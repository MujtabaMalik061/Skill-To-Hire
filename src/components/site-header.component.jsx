import { useEffect, useState } from "react";
import {
  Bell,
  BellRing,
  BriefcaseBusiness,
  LogOut,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "dev-push-notification";
import { toast } from "sonner";
import useAuth from "../hooks/auth.hook.jsx";
import { signOut } from "../services/auth.services.js";
import { subscribeNotifications } from "../services/notifications.services.js";
import { saveFcmToken } from "../services/user.services.js";

const SiteHeader = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isEnablingAlerts, setIsEnablingAlerts] = useState(false);
  const [isPermissionBannerDismissed, setIsPermissionBannerDismissed] =
    useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile?.docId) {
      setUnreadCount(0);
      return undefined;
    }

    const unsubscribe = subscribeNotifications(
      profile.docId,
      (notifications) => {
        setUnreadCount(
          notifications.filter((notification) => !notification.read).length,
        );
      },
      (error) => console.error("Could not load notification count:", error),
    );

    return () => unsubscribe();
  }, [profile?.docId]);

  const handleEnableAlerts = async () => {
    setIsEnablingAlerts(true);
    try {
      const tokenData = await getToken(
        import.meta.env.VITE_Push_Notification,
      );
      if (!tokenData?.token) {
        throw new Error("Could not register this browser for notifications.");
      }
      await saveFcmToken(profile.docId, tokenData.token);
      toast.success("Browser notifications are enabled.");
    } catch (error) {
      toast.error(error.message || "Could not enable browser notifications.");
    } finally {
      setIsEnablingAlerts(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {user &&
        profile &&
        !profile.hasPushToken &&
        !isPermissionBannerDismissed && (
          <aside
            className="notification-permission-banner"
            aria-label="Browser notification permission"
          >
            <BellRing size={17} aria-hidden="true" />
            <p>
              Enable browser notifications to receive application and job
              updates as they happen.
            </p>
            <button
              className="notification-permission-banner__enable"
              type="button"
              disabled={isEnablingAlerts}
              onClick={handleEnableAlerts}
            >
              {isEnablingAlerts ? "Enabling…" : "Enable notifications"}
            </button>
            <button
              className="notification-permission-banner__dismiss"
              type="button"
              aria-label="Dismiss notification permission reminder"
              onClick={() => setIsPermissionBannerDismissed(true)}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </aside>
        )}
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/">
            <span className="brand__mark">
              <BriefcaseBusiness size={18} strokeWidth={2.4} />
            </span>
            <span>
              Skill <strong>to</strong> Hire
            </span>
          </Link>

          <div className="site-header__actions">
            {user && profile ? (
              <>
                <Link
                  className="icon-button site-header__notifications"
                  to="/notifications"
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  className="avatar-link"
                  to="/dashboard"
                  title="Go to dashboard"
                >
                  {(profile.firstName || profile.companyName || "S")
                    .slice(0, 1)
                    .toUpperCase()}
                </Link>
                <button
                  className="button button--quiet site-header__signout"
                  type="button"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link className="button button--quiet" to="/signin">
                  Sign in
                </Link>
                <Link
                  className="button button--primary button--small"
                  to="/signup"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;
