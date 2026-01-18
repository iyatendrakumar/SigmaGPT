import { useEffect, useState } from "react";
import { verifyRegisterOtp } from "../services/authService";

function VerifyOtp({ email, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [timer, setTimer] = useState(30);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= VERIFY OTP ================= */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await verifyRegisterOtp({ email, otp });

      if (!res.success) {
        setError(res.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("OTP verification failed");
    }

    setLoading(false);
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    if (timer > 0) return;

    setResending(true);
    setError("");
    setInfo("");

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/register/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to resend OTP");
        setResending(false);
        return;
      }

      setInfo("OTP resent successfully");
      setTimer(30); // restart countdown
    } catch {
      setError("Failed to resend OTP");
    }

    setResending(false);
  };

  return (
    <div className="authContainer">
      <h2>Verify OTP</h2>

      <form onSubmit={handleVerify}>
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <p className="authHint">
        Didn’t receive OTP?{" "}
        <span
          style={{
            cursor: timer === 0 ? "pointer" : "not-allowed",
            textDecoration: "underline",
            opacity: timer === 0 ? 1 : 0.6
          }}
          onClick={resendOtp}
        >
          {resending
            ? "Resending..."
            : timer > 0
            ? `Resend in ${timer}s`
            : "Resend OTP"}
        </span>
      </p>
    </div>
  );
}

export default VerifyOtp;
