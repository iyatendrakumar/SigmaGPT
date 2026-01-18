import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./context/MyContext";
import { v1 as uuidv1 } from "uuid";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const {
    token,
    user,
    logout,
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats
  } = useContext(MyContext);

  const navigate = useNavigate();

  /* ================= FETCH THREADS ================= */
  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const res = await response.json();

      setAllThreads(
        res.map(thread => ({
          threadId: thread.threadId,
          title: thread.title
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) getAllThreads();
  }, [token]);

  /* ================= NEW CHAT ================= */
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  /* ================= CHANGE THREAD ================= */
  const changeThread = async (threadId) => {
    setCurrThreadId(threadId);

    try {
      const res = await fetch(
        `http://localhost:8080/api/thread/${threadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE THREAD ================= */
  const deleteThread = async (threadId) => {
    try {
      await fetch(`http://localhost:8080/api/thread/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAllThreads(prev =>
        prev.filter(t => t.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="/sigmaGPT_logo.png" alt="SigmaGPT logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads.map((thread, idx) => (
          <li
            key={idx}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
            onClick={() => changeThread(thread.threadId)}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            />
          </li>
        ))}
      </ul>

      {/* USER INFO */}
      <div className="sign">
        <p><strong>{user?.name}</strong></p>
        <p>{user?.email}</p>
        <p
          style={{ cursor: "pointer", marginTop: "6px" }}
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </section>
  );
}

export default Sidebar;
