import AppRoutes from "./router/AppRoutes";
import "./assets/css/style.css";
import "./assets/css/font.css";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { ClientAuthProvider } from "./context/ClientAuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ClientCartProvider } from "./context/ClientCartContext";
import { ClientWishlistProvider } from "./context/ClientWishlistContext.jsx";

const App = () => {
  return (
    <NotificationProvider>
      <ClientAuthProvider>
        <AdminAuthProvider>
          <ClientWishlistProvider>
            <ClientCartProvider>
              <AppRoutes />
            </ClientCartProvider>
          </ClientWishlistProvider>
        </AdminAuthProvider>
      </ClientAuthProvider>
    </NotificationProvider>
  )
};

export default App;
