import { useState, useContext } from "react";
import { MyContext } from "../context/MyContext";
import { loginUser } from "../services/authService";
import "./auth.css";

function Login({ onRegister, onForgot }) {
  const { setToken, setUser } = useContext(MyContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (!res.token) {
        setError(res.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save auth state
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      setError("Something went wrong");
      
    }

    setLoading(false);
  };

  return (
    <div className="authWrapper">
      <div className="authContainer">
        <h2>Login to SigmaGPT</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="passwordToggle"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* UX LINKS */}
        <p className="authHint">
          New user?{" "}
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={onRegister}
          >
            Create an account
          </span>
        </p>
        <p className="authHint">
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={onForgot}
          >
            Forgot password?
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
