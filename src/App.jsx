import AppRoutes from "./router/AppRoutes";
import "./assets/css/style.css";
import "./assets/css/font.css";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </NotificationProvider>
  )
};

export default App;
