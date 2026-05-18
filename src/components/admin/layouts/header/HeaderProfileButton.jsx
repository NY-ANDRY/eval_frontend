import { User, ChevronsUpDown, LogOutIcon, UserIcon, DoorClosed } from "lucide-react";
import { useAdminAuth } from "../../../../context/AdminAuthContext.jsx";
import { useRef, useState } from "react";
import { limitText } from "../../../../lib/utils.js";

const HeaderProfileButton = ({ }) => {
    const { user } = useAdminAuth();

    return (
        <>
            {user ?
                <AuthMenuButton />
                :
                <LoginButton />
            }
        </>
    );
};

const LoginButton = ({ }) => {

    const modalRef = useRef(null);
    const [email, setEmail] = useState("nyandrypaulferdinah@gmail.com");
    const [pwd, setPwd] = useState("abcabcabc");
    const { login } = useAdminAuth();

    const handleOpen = () => {
        if (modalRef) {
            modalRef.current.showModal();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, pwd);
    }

    return (
        <>
            <div onClick={handleOpen} className="flex items-center px-2 py-2 rounded-sm activable-white gap-2.5 text-sm">
                <div className="box-icon">
                    <DoorClosed />
                </div>
                <span>
                    Login
                </span>
            </div>

            <dialog ref={modalRef} className="modal">
                <div className="modal-box w-120 h-160">
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" className="input input-sm w-xs" />
                        <input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" placeholder="password" className="input input-sm w-xs" />
                        <button type="submit">submit</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

const AuthMenuButton = ({ }) => {
    const { user, logout } = useAdminAuth();

    return (
        <div className="dropdown dropdown-center h-full rounded-none!">
            <div tabIndex={0} role="button" className="flex gap-3.5 h-full items-center text-sm font-medium py-2 pl-4 pr-8 rounded-none cursor-pointer
                text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 transition-all">
                <div className="mask mask-squircle flex items-center justify-center w-9 h-9 bg-green-400 rounded-sm">
                    <User className="w-4 h-4 font-light text-white mask" />
                </div>
                <div className="flex flex-col text-xs">
                    <div className="font-bold tracking-wide">
                        {user.name}
                    </div>
                    <div className="flex font-inter-l tracking-wide text-xs text-neutral-500">
                        {limitText(user.email, 20)}
                    </div>
                </div>
            </div>
            <div tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-sm z-1 w-full p-0 border border-neutral-200 bg-neutral-0 transition-all">
                <div className="flex flex-col gap-1 font-inter-l">
                    <button className="flex px-4! gap-1.5 items-center text-sm capitalize relative activable-white rounded-none! h-12">
                        <UserIcon className="w-4 h-4 mr-2 relative -top-px" />
                        <span>
                            profile
                        </span>
                    </button>
                    <button onClick={logout} className="flex px-4! gap-1.5 items-center text-sm capitalize relative activable-white rounded-none! h-12">
                        <LogOutIcon className="w-4 h-4 mr-2 relative -top-px" />
                        <span>
                            deconnexion
                        </span>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default HeaderProfileButton;