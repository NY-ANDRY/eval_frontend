import { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../lib/const";
import { useNotification } from "./NotificationContext";

const ClientAuthContext = createContext(null);

export const ClientAuthProvider = ({ children }) => {
  const { mutate: mutateLogin } = useMutation(`${API_URL_CLIENT}/customer/login`, 'POST');
  const { mutate: mutateLogout } = useMutation(`${API_URL_CLIENT}/logout`, 'DELETE');
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
        notify("login client failed");
        return;
      }

      localStorage.setItem("bagisto_client_token", loginRes.token);
      localStorage.setItem("bagisto_client", JSON.stringify(loginRes.data));
      refreshUser();

      notify(loginRes?.message + " / ok");
    } catch (error) {
      notify("error client login: " + error.message);
    }
  };

  const logout = async () => {
    mutateLogout();
    localStorage.removeItem("bagisto_client_token");
    localStorage.removeItem("bagisto_client");
    refreshUser();

    notify("logout ok");
  };

  const refreshUser = () => {
    let userStorage = localStorage.getItem("bagisto_client");
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
    <ClientAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);
