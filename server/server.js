// ========================================
// MERN BLOG BACKEND SERVER - MAIN ENTRY POINT
// ========================================

console.log("Starting MERN Blog Backend Server... in server.js")

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Loading environment configuration... in server.js")
// Use absolute path to ensure config.env is found regardless of where server is started
const configPath = path.join(__dirname, 'Config', 'config.env');
const envResult = dotenv.config({
    path: configPath
});

if (envResult.error) {
    console.error("Error loading config.env:", envResult.error);
    console.error("Tried path:", configPath);
} else {
    console.log("Environment variables loaded successfully from:", configPath);
    // Log Cloudinary config status
    console.log("Cloudinary Config Check:");
    console.log("  - CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗ MISSING");
    console.log("  - CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✓" : "✗ MISSING");
    console.log("  - CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✓" : "✗ MISSING");
}

// Import custom modules
import IndexRoute from "./Routers/index.js";
import connectDatabase from "./Helpers/database/connectDatabase.js";
import customErrorHandler from "./Middlewares/Errors/customErrorHandler.js";
import initializeAdmin from "./Helpers/auth/initAdmin.js";

console.log("Custom modules imported successfully in server.js")

// ========================================
// DATABASE CONNECTION
// ========================================
// Connect to MongoDB database
console.log("Connecting to database... in server.js")
connectDatabase()

// Initialize default admin account after database connection
console.log("Initializing default admin account... in server.js")
// Use setTimeout to ensure database connection is established
setTimeout(() => {
    initializeAdmin()
}, 2000)

// ========================================
// EXPRESS APP INITIALIZATION
// ========================================
console.log("Initializing Express app... in server.js")
const app = express();
console.log("Express app initialized in server.js")

import http from "http";
import { Server } from "socket.io";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? ['https://your-production-domain.com']
            : ['http://localhost:3000'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected via Socket.IO');

    socket.on("joinUserRoom", (userId) => {
        socket.join(userId);
        socket.userId = userId; // Track user against this socket
        console.log(`User ${userId} joined their personal room`);
        
        // Broadcast to others that this user is online
        socket.broadcast.emit("userOnline", userId);
    });

    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket joined conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            // Check if they have other open web-sockets in their user room (e.g. multiple tabs)
            const room = io.sockets.adapter.rooms.get(socket.userId);
            if (!room || room.size === 0) {
                // If they have no more active sockets, broadcast offline
                socket.broadcast.emit("userOffline", socket.userId);
            }
        }
        console.log("User disconnected via Socket.IO");
    });
});

// Make io accessible in routers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ========================================
// SECURITY MIDDLEWARE
// ========================================
// Helmet helps secure Express apps by setting various HTTP headers
console.log("Setting up security middleware (Helmet)... in server.js")
app.use(helmet())
console.log("Helmet security middleware configured in server.js")

// ========================================
// RATE LIMITING
// ========================================
// Prevent abuse by limiting requests per IP address
console.log("Setting up rate limiting... in server.js")
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Time window: 15 minutes
    max: 100, // Maximum 100 requests per IP per window
    message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)
console.log("Rate limiting configured (100 requests per 15 minutes) in server.js")

// ========================================
// COOKIE PARSER MIDDLEWARE
// ========================================
// Parse cookies for httpOnly cookie support
console.log("Setting up cookie parser... in server.js")
app.use(cookieParser())
console.log("Cookie parser configured in server.js")

// ========================================
// BODY PARSING MIDDLEWARE
// ========================================
// Parse JSON bodies with 10MB limit (for large file uploads)
console.log("Setting up body parsing middleware... in server.js")
app.use(express.json({ limit: '10mb' }))
// Parse URL-encoded bodies with 10MB limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
console.log("Body parsing middleware configured (10MB limit) in server.js")

// ========================================
// CORS CONFIGURATION
// ========================================
// Configure Cross-Origin Resource Sharing
console.log("Setting up CORS configuration... in server.js")
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-production-domain.com']  // Production: specific domain
        : ['http://localhost:3000'],              // Development: React dev server
    credentials: true,                            // Allow cookies/credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']     // Allowed headers
}))
console.log("CORS configured for:", process.env.NODE_ENV === 'production' ? 'production' : 'development', "in server.js")

// ========================================
// ROUTES
// ========================================
// Mount all API routes under root path
console.log("Setting up API routes... in server.js")
app.use("/", IndexRoute)
console.log("API routes mounted in server.js")

// ========================================
// ERROR HANDLING
// ========================================
// Global error handler - must be after routes
console.log("Setting up global error handler... in server.js")
app.use(customErrorHandler)
console.log("Global error handler configured in server.js")

// ========================================
// STATIC FILES
// ========================================
// Serve static files (images, etc.) from public directory
console.log("Setting up static file serving... in server.js")
app.use(express.static(path.join(__dirname, "public")))
console.log("Static files configured from public directory in server.js")

// ========================================
// SERVER STARTUP
// ========================================
const PORT = process.env.PORT || 5000; // Use environment PORT or default to 5000
console.log(`Starting server on port ${PORT}... in server.js`)

// Start the server
const server = httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode in server.js`)
    console.log(`API available at: http://localhost:${PORT}`)
    console.log(`Static files at: http://localhost:${PORT}/public`)
})

// ========================================
// ERROR HANDLING FOR UNHANDLED PROMISES
// ========================================
// Gracefully handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log("Unhandled Promise Rejection:", err, "in server.js")
    // Close server and exit process
    server.close(() => process.exit(1))
})