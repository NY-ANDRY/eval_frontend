import { createContext, useContext, useState, useEffect } from "react";

const NotifContext = createContext(null);

export const NotifProvider = ({ children }) => {
  
  const notify = () => {
    console.log("notified");
  }

  return (
    <NotifContext.Provider value={{ notify }}>
      {children}
    </NotifContext.Provider>
  );
};

export const useNotif = () => useContext(NotifContext);
