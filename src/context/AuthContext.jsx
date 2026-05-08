import { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "../hooks/useHttpRequest";
import { API_URL } from "../lib/const";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { mutate: mutateLogin } = useMutation(`${API_URL}/login`, 'POST');
  const { mutate: mutateLogout } = useMutation(`${API_URL}/logout`, 'DELETE');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  const login = async (email, password) => {
    const loginRes = await mutateLogin({
      email,
      password,
      device_name: "web"
    });

    if (!loginRes.token) {
      return;
    }

    localStorage.setItem("bagisto_user_token", loginRes.token);
    localStorage.setItem("bagisto_user", JSON.stringify(loginRes.data));
    refreshUser();
    
    notify("login ok");
  };

  const logout = async () => {
    mutateLogout();
    localStorage.removeItem("bagisto_user_token");
    localStorage.removeItem("bagisto_user");
    refreshUser();

    notify("logout ok");
  };

  const refreshUser = () => {
    let userStorage = localStorage.getItem("bagisto_user");
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
