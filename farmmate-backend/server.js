const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Profile route

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes); // ✅ Mount profile route

// Test route
app.get("/", (req, res) => {
  res.send("🌾 Welcome to FarmMate Backend!");
});

// HTTP server setup
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust as needed
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
});
