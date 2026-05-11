import { useState } from "react";
import { useMutation } from "../../hooks/useHttpRequest";
import { API_URL_ADMIN } from "../../lib/const";
import { useClientAuth } from "../../context/ClientAuthContext";

const Login = () => {
    const { login } = useClientAuth();
    const [email, setEmail] = useState("abc@gmail.com");
    const [pwd, setPwd] = useState("abcabcabc");

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, pwd);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-xs">
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" className="input input-sm" />
            <input onChange={(e) => setPwd(e.target.value)} value={pwd} type="text" className="input input-sm" />
            <button className="btn btn-sm">submit</button>
        </form>
    )

}

export default Login;