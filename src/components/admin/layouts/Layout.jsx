import { Outlet } from "react-router-dom";
import { useLocation, useOutlet } from "react-router-dom";
import Sidebar from "./sidebar/main/Sidebar.jsx";
import { AnimatePresence, motion } from "motion/react";
import Header from "./header/Header.jsx";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

const Layout = ({ children }) => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen max-h-screen min-w-screen overflow-y-hidden flex font-inter text-neutral-800 bg-neutral-50 p-0">
      <Sidebar />

      <main className="flex-1 relative overflow-x-hidden flex flex-col items-center w-full max-h-full mt-3 bg-white border border-neutral-200 rounded-tl-2xl">
        <Header />
        <AnimatePresence mode="wait">
          {outlet && (
            <motion.div
              key={location.pathname}
              {...fade}
              className="flex-1 flex flex-col w-full max-h-full overflow-auto pt-4 px-4"
            >
              {outlet}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
};

export default Layout;
