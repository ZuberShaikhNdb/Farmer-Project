import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Make sure your .env contains GEMINI_API_KEY=your_key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
