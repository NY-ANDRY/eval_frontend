import { Link } from "react-router-dom";
import { UserIcon, ShoppingCart } from "lucide-react";

const Header = () => {


    return (
        <header className="flex-1 flex items-center justify-between py-3 px-2">

            <Link to={'/'}>
                <div className="text-xl font-bold tracking-widest">Revolution</div>
            </Link>

            <div className="header-nav flex items-center gap-4">
                <Link to={'/cart'} className="p-2">
                    <ShoppingCart className="w-6" />
                </Link>
                <Link to={'/login'} className="p-2">
                    <UserIcon className="w-6" />
                </Link>
            </div>

        </header>
    )
}

export default Header;