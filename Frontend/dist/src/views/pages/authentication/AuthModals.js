import { useState } from "react";
import LoginBasic from "./LoginBasic";
import ForgotPassword from "./ForgotPassword";

const AuthModals = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const [forgotOpen, setForgotOpen] = useState(false);

    return (
        <>
            <button onClick={() => setLoginOpen(true)}>Login</button>

            <LoginBasic
                isOpen={loginOpen}
                toggle={() => setLoginOpen(!loginOpen)}
                openRegister={() => alert("Open Register Modal")}
                openForgotPassword={() => {
                    setLoginOpen(false);
                    setForgotOpen(true);
                }}
            />

            <ForgotPassword
                isOpen={forgotOpen}
                toggle={() => setForgotOpen(!forgotOpen)}
            />
        </>
    );
};

export default AuthModals;
