import { Outlet } from "react-router-dom";
import Nav from "./nav/main/Nav";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen max-h-screen overflow-x-hidden flex flex-col font-inter text-neutral-800">
      <div className="flex justify-center w-full border-b border-neutral-200">
        <div className="flex justify-center w-7xl">
          <Header />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center w-full max-h-full overflow-hidden">
        <main className="relative flex flex-col items-center w-7xl max-h-full overflow-hidden overflow-y-auto">
          {children ?? <Outlet />}
        </main>
      </div>

    </div>
  );
};

export default Layout;
