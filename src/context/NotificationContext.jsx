import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {

  const [notifications, setNotifications] = useState([]);
  const notify = (content, durationSec = 3) => {
    const id = Date.now() + Math.random().toString();

    setNotifications((prev) => [
      ...prev,
      { id, content }
    ]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== id)
      );
    }, durationSec * 1000);
  }

  const [globalLoading, setGlobalLoading] = useState(false);
  useEffect(() => {

    if (globalLoading) {

    }

    return () => {

    }
  }, [globalLoading]);


  return (
    <NotificationContext.Provider value={{ notify, setGlobalLoading }}>

      <div className="fixed top-4 right-12 flex flex-col items-end gap-2 z-50">
        <AnimatePresence mode="popLayout">
          {globalLoading &&
            <motion.span
              {...fadeNotification}
              key={0}
              layout
              className="loading loading-spinner loading-xl"></motion.span>
          }
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              {...fadeNotification}
              key={notification.id}
              layout
              className="relative bg-neutral-50 text-neutral-800 px-4 py-3.5 rounded border border-neutral-200 shadow-xs w-72"
            >
              {notification.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

const fadeNotification = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};