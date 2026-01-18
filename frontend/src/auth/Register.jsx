import { useState } from "react";
import { sendRegisterOtp } from "../services/authService";

function Register({ onOtpSent }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await sendRegisterOtp({ name, email, password });

      if (!res.success) {
        setError(res.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      onOtpSent({ email });
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="authContainer">
      <h2>Create SigmaGPT Account</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button disabled={loading}>
          {loading ? "Sending OTP..." : "Register"}
        </button>
      </form>

      {/* UX LINK */}
      <p className="authHint">
        Already have an account?{" "}
        <span
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;
