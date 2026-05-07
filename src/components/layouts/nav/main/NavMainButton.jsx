import { BookIcon } from "lucide-react";

const NavMainButton = ({ }) => {
    return (
        <div className="flex gap-2.5 items-center text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-50 py-2 px-2 rounded-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-green-400 rounded-sm">
                <BookIcon className="w-4 h-4 font-light text-white" />
            </div>
            <div className="flex flex-col text-xs">
                <div className="flex text-2xl font-is font-bold">ETU003549</div>
            </div>
        </div>
    );
};

export default NavMainButton;