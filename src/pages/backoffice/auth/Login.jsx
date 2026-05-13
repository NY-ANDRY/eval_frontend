import { useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext";

const Login = () => {
    const { login } = useAdminAuth();
    const [email, setEmail] = useState("nyandrypaulferdinah@gmail.com");
    const [pwd, setPwd] = useState("abcabcabc");

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, pwd);
    }

    return (
        <div className="flex flex-col gap-4 items-center pt-48">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-60">
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" className="input input-sm" />
                <input onChange={(e) => setPwd(e.target.value)} value={pwd} type="text" className="input input-sm" />
                <button className="btn btn-sm btn-neutral">submit</button>
            </form>
        </div>
    )

}

export default Login;