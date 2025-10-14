import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini client safely - don't let failures here crash the server
let genAI = null;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Gemini client initialized');
  } else {
    console.warn('GEMINI_API_KEY not set - chatbot will be unavailable');
  }
} catch (err) {
  console.error('Failed to initialize Gemini client:', err);
  genAI = null;
}

router.post("/", async (req, res) => {
  if (!genAI) return res.status(503).json({ error: 'Chat service unavailable' });
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
