import { User, ChevronsUpDown, LogOutIcon, User2Icon, DoorClosed } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useRef, useState } from "react";

const NavFooterButton = ({ }) => {
    const { user } = useAuth();

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
    const { login } = useAuth();

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
    const { user, logout } = useAuth();

    return (
        <div className="dropdown dropdown-right dropdown-end">
            <div tabIndex={0} role="button" className="flex gap-2.5 items-center text-sm font-medium py-2 px-2 rounded-sm cursor-pointer
                text-neutral-700 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 focus:bg-neutral-100">
                <div className="flex items-center justify-center w-8 h-8 bg-green-400 rounded-sm">
                    <User className="w-4 h-4 font-light text-white" />
                </div>
                <div className="flex flex-col text-xs">
                    <div className="font-bold tracking-wide">
                        {user.name}
                    </div>
                    <div className="flex font-inter-l tracking-wide w-32 truncate">
                        {user.email}
                    </div>
                </div>
                <div className="flex-1"></div>
                <ChevronsUpDown className="w-4 h-4" />
            </div>
            <div tabIndex="-1" className="dropdown-content left-[102%] menu bg-base-100 rounded-sm z-1 w-48 p-1 shadow-sm border border-neutral-200 bg-neutral-50 transition-all">
                <div className="flex flex-col gap-1 font-inter-l">
                    <button className="flex gap-1.5 items-center text-xs capitalize relative activable-white">
                        <User2Icon className="w-3.5 h-3.5 mr-2 relative -top-px" />
                        <span>
                            profile
                        </span>
                    </button>
                    <button onClick={logout} className="flex gap-1.5 items-center text-xs capitalize relative activable-white">
                        <LogOutIcon className="w-3.5 h-3.5 mr-2 relative -top-px" />
                        <span>
                            deconnexion
                        </span>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default NavFooterButton;