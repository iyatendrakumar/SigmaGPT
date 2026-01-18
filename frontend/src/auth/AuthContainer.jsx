import { useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import VerifyOtp from "./VerifyOtp";
import ForgotPassword from "./ForgotPassword";

function AuthContainer() {
  const navigate = useNavigate();
  const location = useLocation();

  const screen = location.pathname;

  if (screen === "/register") {
    return (
      <Register
        onOtpSent={({ email }) => {
          sessionStorage.setItem("otpEmail", email);
          navigate("/verify-otp");
        }}
      />
    );
  }

  if (screen === "/verify-otp") {
    return (
      <VerifyOtp
        email={sessionStorage.getItem("otpEmail")}
        onSuccess={() => navigate("/login")}
      />
    );
  }

  if (screen === "/forgot-password") {
    return <ForgotPassword onBack={() => navigate("/login")} />;
  }

  // default = login
  return (
    <Login
      onRegister={() => navigate("/register")}
      onForgot={() => navigate("/forgot-password")}
    />
  );
}

export default AuthContainer;
