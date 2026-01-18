import { useState } from "react";
import { sendResetOtp, resetPassword } from "../services/authService";
import "./auth.css";

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await sendResetOtp({ email });

      if (!res.success) {
        setError(res.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setStep(2);
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const reset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await resetPassword({
        email,
        otp,
        newPassword: password
      });

      if (!res.success) {
        setError(res.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      alert("Password reset successful. Please login.");
      onBack();
    } catch {
      setError("Password reset failed");
    }

    setLoading(false);
  };

  return (
    <div className="authWrapper">
      <div className="authContainer">
        {step === 1 ? (
          <>
            <h2>Forgot Password</h2>
            <form onSubmit={sendOtp}>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
            <p className="authHint">
              <span
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={onBack}
              >
                Back to login
              </span>
            </p>
          </>
        ) : (
          <>
            <h2>Reset Password</h2>
            <form onSubmit={reset}>
              <input
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
