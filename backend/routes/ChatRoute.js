import express from "express";
import Conversation from "../models/Conversation.js";
import OpenAI from "openai";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

router.post("/chat", async (req, res) => {
    const { sessionId, userMessage } = req.body;

    try {
        // 1. Find or create conversation
        let conversation = await Conversation.findOne({ sessionId });
        if (!conversation) {
            conversation = new Conversation({
                sessionId,
                messages: [
                    { role: "system", content: "You are sigmaGPT, a helpful assistant." }
                ]
            });
        }

        // 2. Add new user message
        conversation.messages.push({ role: "user", content: userMessage });

        // 3. Send entire conversation to GPT
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversation.messages
        });

        const assistantReply = response.choices[0].message.content;

        // 4. Save assistant reply to database
        conversation.messages.push({
            role: "assistant",
            content: assistantReply
        });

        await conversation.save();

        // 5. Respond to frontend
        res.json({ reply: assistantReply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
