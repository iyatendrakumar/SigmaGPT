import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./context/MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    token,
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    allThreads,
    setAllThreads
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  /* ================= SEND MESSAGE ================= */
  const getReply = async () => {
    if (!token || !prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId
        })
      });

      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ================= UPDATE CHAT ================= */
  useEffect(() => {
    if (prompt && reply) {
      const isFirstMessage = allThreads.every(
        t => t.threadId !== currThreadId
      );

      if (isFirstMessage) {
        setAllThreads(prev => [
          { threadId: currThreadId, title: prompt.slice(0, 30) },
          ...prev
        ]);
      }

      setPrevChats(prev => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
      ]);
    }

    setPrompt("");
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>SigmaGPT</span>
      </div>

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
