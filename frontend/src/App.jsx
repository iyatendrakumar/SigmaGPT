import "./App.css";
import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "./context/MyContext";

import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import AuthContainer from "./auth/AuthContainer";

function App() {
  const { token } = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= ROUTE GUARD ================= */
  useEffect(() => {
    if (!token && location.pathname === "/chat") {
      navigate("/login", { replace: true });
    }

    if (token && (location.pathname === "/" || location.pathname === "/login")) {
      navigate("/chat", { replace: true });
    }
  }, [token, location.pathname]);

  return (
    <div className="app">
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />
        <Route path="/verify-otp" element={<AuthContainer />} />
        <Route path="/forgot-password" element={<AuthContainer />} />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            token ? (
              <>
                <Sidebar />
                <ChatWindow />
              </>
            ) : (
              <AuthContainer />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<AuthContainer />} />
      </Routes>
    </div>
  );
}

export default App;
