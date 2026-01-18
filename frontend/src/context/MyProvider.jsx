import { useEffect, useState } from "react";
import { MyContext } from "./MyContext";

export const MyProvider = ({ children }) => {
  /* ================= AUTH ================= */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  /* ================= CHAT ================= */
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [allThreads, setAllThreads] = useState([]);
  const [newChat, setNewChat] = useState(true);

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    setPrompt("");
    setReply(null);
    setCurrThreadId(null);
    setPrevChats([]);
    setAllThreads([]);
    setNewChat(true);
  };

  /* ================= SAFE FETCH ================= */
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      logout();
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    return res;
  };

  return (
    <MyContext.Provider
      value={{
        /* auth */
        token,
        setToken,
        user,
        setUser,
        logout,
        authFetch,

        /* chat */
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        prevChats,
        setPrevChats,
        allThreads,
        setAllThreads,
        newChat,
        setNewChat
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
