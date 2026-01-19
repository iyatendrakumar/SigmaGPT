import express from "express";
import Thread from "../models/Thread.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import getOpenApiResponse from "../utils/openai.js";

const router = express.Router();

/* ================= GET ALL THREADS ================= */
router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 });

    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

/* ================= GET SINGLE THREAD ================= */
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      userId: req.user.userId
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

/* ================= DELETE THREAD ================= */
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const deleted = await Thread.findOneAndDelete({
      threadId,
      userId: req.user.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

/* ================= CHAT ================= */
router.post("/chat", authMiddleware, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.user.userId,
    });

    if (!thread) {
      thread = new Thread({
        userId: req.user.userId,
        threadId,
        title: message.slice(0, 30),
        messages: [],
      });
    }

    // 1️⃣ Add user message to DB
    thread.messages.push({ role: "user", content: message });

    // 2️⃣ Build FULL conversation for GPT
    const messagesForGPT = thread.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // 3️⃣ Ask GPT with full context
    const assistantReply = await getOpenApiResponse(messagesForGPT);

    // 🛑 SAFETY CHECK
    if (!assistantReply) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    // 4️⃣ Save assistant reply
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
