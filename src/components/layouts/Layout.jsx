import { Outlet } from "react-router-dom";
import { useLocation, useOutlet } from "react-router-dom";
import Header from "./Header";
import { AnimatePresence, motion } from "motion/react";

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
    <div className="min-h-screen max-h-screen overflow-x-hidden flex flex-col font-inter text-neutral-800">
      <div className="flex justify-center w-full border-b border-neutral-200">
        <div className="flex justify-center w-7xl">
          <Header />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center w-full max-h-full overflow-hidden">
        <main className="relative flex flex-col items-center max-h-full overflow-hidden overflow-y-auto">
          <AnimatePresence mode="wait">
            {outlet && (
              <motion.div
                key={location.pathname}
                {...fade}
                className="flex-1 flex flex-col w-7xl max-h-full overflow-hidden overflow-y-auto"
              >
                {outlet}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};

export default Layout;
