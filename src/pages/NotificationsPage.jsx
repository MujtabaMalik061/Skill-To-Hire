import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import {
  markNotificationRead,
  getNotificationsPage,
} from "../services/notifications.services.js";
import "../assets/styles/NotificationsPage.css";

const NotificationsPage = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const loadNotifications = useCallback(async ({
    nextCursor = null,
    append = false,
  } = {}) => {
    if (!profile?.docId) {
      return;
    }

    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const page = await getNotificationsPage({
        recipientDocId: profile.docId,
        cursor: nextCursor,
      });
      setNotifications((currentNotifications) =>
        append ? [...currentNotifications, ...page.items] : page.items,
      );
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error("Could not load notifications:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [profile?.docId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
    } catch (error) {
      console.error("Could not mark notification as read:", error);
    }
  };

  return (
    <main className="page-container page-section notifications-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">STAY IN THE LOOP</span>
          <h1>Notifications</h1>
          <p>Application and account updates, as they happen.</p>
        </div>
      </div>

      <section className="notification-panel glass-card">
        {isLoading ? (
          <Loading label="Loading notifications" />
        ) : notifications.length ? (
          <div className="notification-list">
            {notifications.map((notification) => (
              <article
                className={`notification-row${notification.read ? " is-read" : " is-unread"}`}
                key={notification.id}
              >
                <span className="notification-row__icon"><Bell size={16} /></span>
                <div className="notification-row__content">
                  <h2>{notification.title}</h2>
                  <p>{notification.body}</p>
                  <span>
                    {notification.createdAt?.seconds
                      ? new Date(notification.createdAt.seconds * 1000).toLocaleString()
                      : "Just now"}
                  </span>
                </div>
                <div className="notification-row__actions">
                  {!notification.read && (
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => handleRead(notification.id)}
                      aria-label="Mark notification as read"
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <Link
                    className="icon-button"
                    to={notification.link || "/dashboard"}
                    aria-label="Open related page"
                    onClick={() => handleRead(notification.id)}
                  >
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </article>
            ))}
            {hasMore && (
              <div className="notification-list__load-more">
                <button
                  className="button button--quiet"
                  type="button"
                  disabled={isLoadingMore}
                  onClick={() =>
                    loadNotifications({ nextCursor: cursor, append: true })
                  }
                >
                  {isLoadingMore ? "Loading…" : "Load more notifications"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon"><Bell size={20} /></div>
            <h2>You’re all caught up</h2>
            <p>Updates about your applications and account will show up here.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default NotificationsPage;
