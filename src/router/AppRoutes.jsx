import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import PageTransition from "../components/transitions/PageTransition";
import routes from "./routes";
import Layout from "../components/layouts/Layout";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PageTransition>
                  <route.component />
                </PageTransition>
              }
            />
          ))}
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;

import { useRoutes } from "react-router-dom";
import { advancedRoute } from "./routes";

export function AppRoute2() {
  const routes = useRoutes(advancedRoute);

  return routes;
}

