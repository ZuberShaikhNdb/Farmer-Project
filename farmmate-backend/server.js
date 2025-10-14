import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chat.js"; // Gemini Chatbot route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Fix __dirname in ESM
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
import purchaseRoutes from "./routes/purchaseRoutes.js";
// ...existing code...
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/purchase", purchaseRoutes); // OTP purchase flow

// Test route
app.get("/", (req, res) => {
  res.send("🌾 Welcome to FarmMate Backend!");
});

// HTTP server setup
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("joinProductRoom", (productId) => {
    socket.join(`product_${productId}`);
    console.log(`User ${socket.id} joined room: product_${productId}`);
  });

  socket.on("leaveProductRoom", (productId) => {
    socket.leave(`product_${productId}`);
    console.log(`User ${socket.id} left room: product_${productId}`);
  });

  socket.on("sendMessage", (data) => {
    const { productId, content } = data;
    console.log(`Message in room product_${productId} from ${socket.id}:`, content);
    io.to(`product_${productId}`).emit("receiveMessage", {
      senderId: socket.id,
      content,
      timestamp: new Date().toISOString(),
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("Gemini API Key:", process.env.GEMINI_API_KEY?.slice(0, 10));

});
