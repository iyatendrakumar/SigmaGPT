import { useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import VerifyOtp from "./VerifyOtp";
import ForgotPassword from "./ForgotPassword";

function AuthContainer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* ================= REGISTER FLOW ================= */

  if (pathname === "/register") {
    return (
      <Register
        onOtpSent={({ email }) => {
          sessionStorage.setItem("otpEmail", email);
          navigate("/verify-otp");
        }}
      />
    );
  }

  if (pathname === "/verify-otp") {
    return (
      <VerifyOtp
        email={sessionStorage.getItem("otpEmail")}
        onSuccess={() => navigate("/login")}
        onBack={() => navigate("/register")}
      />
    );
  }

  /* ================= FORGOT PASSWORD ================= */

  if (pathname === "/forgot-password") {
    return <ForgotPassword onBack={() => navigate("/login")} />;
  }

  /* ================= DEFAULT (LOGIN) ================= */

  return (
    <Login
      onRegister={() => navigate("/register")}
      onForgot={() => navigate("/forgot-password")}
    />
  );
}

export default AuthContainer;
