import { SearchIcon } from "lucide-react";
import HeaderProfileButton from "./HeaderProfileButton.jsx";
const Header = () => {

  return (
    <header className="flex items-center justify-between h-15 border-b border-neutral-200 w-full px-4">
      <div className="flex items-center gap-1 border border-neutral-200 rounded-xl px-4 w-sm">
        <SearchIcon className="text-neutral-400 w-5 h-5" />
        <input type="text" className="input border-none rounded-none!" placeholder="Search" />
      </div>
      <HeaderProfileButton />
    </header>
  );
};

export default Header;