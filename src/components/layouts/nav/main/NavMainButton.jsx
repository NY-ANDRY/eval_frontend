import { DraftingCompass } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

const NavMainButton = ({ }) => {
    const { user } = useAuth();
    return (
        <div className="flex gap-2.5 items-center text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-50 py-2 px-2 rounded-sm">
            <div className="box-icon">
                <DraftingCompass />
            </div>
            <div className="flex flex-col text-xs">
                {user ?
                    <div className="flex flex-col">
                        <div className="flex tracking-wider font-bold">
                            {user.role.name}
                        </div>
                        <div className="flex text-neutral-400">
                            {user.role.permission_type}
                        </div>
                    </div>
                    :
                    <div className="flex flex-col">
                        <div className="flex tracking-wider font-black">
                            bagisto
                        </div>
                        <div className="flex text-neutral-400">
                            frontend
                        </div>
                    </div>
                }
                <div className="flex text-xl font-is font-semibold capital"></div>
            </div>
        </div>
    );
};

export default NavMainButton;