const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require('http'); // Import the built-in HTTP module
const { Server } = require("socket.io"); // Import Socket.IO Server class
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // handles JSON data
app.use(express.urlencoded({ extended: true })); // handles form-urlencoded data

// Serve static uploads (for image previews)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
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
//const messageRoutes = require("./routes/message"); // Import message routes

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
//app.use("/api", messageRoutes); // Mount message routes under /api

// Root test route
app.get("/", (req, res) => {
    res.send("🌾 Welcome to FarmMate Backend!");
});

// Create an HTTP server instance
const server = http.createServer(app);

// Initialize Socket.IO by passing the HTTP server instance
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your React frontend URL
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Join Product Room
    socket.on('joinProductRoom', (productId) => {
        socket.join(`product_${productId}`);
        console.log(`User ${socket.id} joined room: product_${productId}`);
    });

    // Leave Product Room
    socket.on('leaveProductRoom', (productId) => {
        socket.leave(`product_${productId}`);
        console.log(`User ${socket.id} left room: product_${productId}`);
    });

    // Handle sending messages
    socket.on('sendMessage', (data) => {
        const { productId, content } = data;
        console.log(`Received message in room product_${productId} from ${socket.id}:`, content);
        // Broadcast the message to all clients in the product-specific room
        io.to(`product_${productId}`).emit('receiveMessage', {
            senderId: socket.id, // Optionally include sender ID
            content: content,
            timestamp: new Date().toISOString(), // Optionally include timestamp
        });
    });
});

// Start the HTTP server using the 'server' instance (for Socket.IO)
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
