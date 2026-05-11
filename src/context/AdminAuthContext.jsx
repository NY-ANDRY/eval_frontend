import { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "../hooks/useHttpRequest";
import { API_URL_ADMIN } from "../lib/const";
import { useNotification } from "./NotificationContext";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const { mutate: mutateLogin } = useMutation(`${API_URL_ADMIN}/login`, 'POST');
  const { mutate: mutateLogout } = useMutation(`${API_URL_ADMIN}/logout`, 'DELETE');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  const login = async (email, password) => {
    try {
      const loginRes = await mutateLogin({
        email,
        password,
        device_name: "web"
      });

      if (!loginRes?.token) {
        notify("login failed");
        return;
      }

      localStorage.setItem("bagisto_admin_token", loginRes.token);
      localStorage.setItem("bagisto_admin", JSON.stringify(loginRes.data));
      refreshUser();

      notify(loginRes?.message + " / ok");
    } catch (error) {
      notify("error login: " + error.message);
    }
  };

  const logout = async () => {
    mutateLogout();
    localStorage.removeItem("bagisto_admin_token");
    localStorage.removeItem("bagisto_admin");
    refreshUser();

    notify("logout ok");
  };

  const refreshUser = () => {
    let userStorage = localStorage.getItem("bagisto_admin");
    if (userStorage) {
      let userStorageParse = JSON.parse(userStorage);
      setUser(userStorageParse);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {

    // user
    refreshUser();
    //

  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
