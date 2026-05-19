import { useLocation, useOutlet } from "react-router-dom";
import Header from "./Header";
import { AnimatePresence, motion } from "motion/react";
import { ClientCartProvider } from "../../context/ClientCartContext";
import { ClientWishlistProvider } from "../../context/ClientWishlistContext.jsx";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

const Layout = ({ }) => {
  const location = useLocation();
  const outlet = useOutlet();

  return (

    <ClientWishlistProvider>
      <ClientCartProvider>
        <div className="min-h-screen max-h-screen overflow-x-hidden flex flex-col font-inter text-neutral-800">
          <div className="flex justify-center w-full border-b border-neutral-200">
            <div className="flex w-360">
              <Header />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center w-full max-h-full overflow-hidden">
            <main className="relative flex flex-col max-h-full w-360 overflow-hidden overflow-y-auto">
              <AnimatePresence mode="wait">
                {outlet && (
                  <motion.div
                    key={location.pathname}
                    {...fade}
                    className="flex-1 flex flex-col w-full max-h-full overflow-hidden overflow-y-auto"
                  >
                    {outlet}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>

        </div>
      </ClientCartProvider>
    </ClientWishlistProvider>
  );
};

export default Layout;
