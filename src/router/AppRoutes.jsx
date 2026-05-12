import routes from "./routes";
import { useRoutes } from "react-router-dom";
import { advancedRoute } from "./routes";

const AppRoutes = () => {
  const routes = useRoutes(advancedRoute);
  return routes;
}

export default AppRoutes;