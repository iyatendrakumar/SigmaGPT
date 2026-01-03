import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    messages: [messageSchema]
});

export default mongoose.model("Conversation", conversationSchema);
