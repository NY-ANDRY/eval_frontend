import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {

  const [notifications, setNotifications] = useState([]);
  const notify = (content, durationSec = 3, color = "white") => {
    const id = Date.now() + Math.random().toString();

    setNotifications((prev) => [
      ...prev,
      { id, content, color }
    ]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== id)
      );
    }, durationSec * 1000);
  }

  const handleClick = (id) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== id)
    );
  }

  const [globalLoading, setGlobalLoading] = useState(false);
  useEffect(() => {

    if (globalLoading) {

    }

    return () => {

    }
  }, [globalLoading]);


  return (
    <NotificationContext.Provider value={{ notify, setGlobalLoading, globalLoading }}>

      <div className="fixed top-4 right-6 flex flex-col gap-2 z-50 w-80">
        <div className="flex w-full flex-row-reverse">
          <AnimatePresence mode="popLayout">
            {globalLoading &&
              <motion.span
                {...fadeNotification}
                key={0}
                layout
                className="loading loading-spinner loading-xl relative right-0"></motion.span>
            }
          </AnimatePresence>
        </div>

        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              onClick={() => handleClick(notification.id)}
              {...fadeNotification}
              key={notification.id}
              layout
              className="relative bg-neutral-50 text-neutral-800 px-4 py-3.5 rounded border border-neutral-200 shadow-xs w-80 cursor-pointer"
            >
              {notification.color == "white" &&
                <div className="status mr-3 relative bottom-0.5"></div>
              }

              {notification.color == "green" &&
                <div className="status status-success mr-3 relative bottom-0.5"></div>
              }

              {notification.color == "yellow" &&
                <div className="status status-warning mr-3 relative bottom-0.5"></div>
              }

              {notification.color == "red" &&
                <div className="status status-error mr-3 relative bottom-0.5"></div>
              }
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