// ========================================
// MERN BLOG BACKEND SERVER - MAIN ENTRY POINT
// ========================================



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



// ========================================
// DATABASE CONNECTION
// ========================================
// Connect to MongoDB database

connectDatabase()

// Initialize default admin accounts after database connection

// Use setTimeout to ensure database connection is established
setTimeout(async () => {
    await initializeAdmin()         // Legacy (for existing User model admins)
}, 2000)

// ========================================
// EXPRESS APP INITIALIZATION
// ========================================

const app = express();


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
    // console.log('A user connected via Socket.IO');

    socket.on("joinUserRoom", (userId) => {
        socket.join(userId);
        socket.userId = userId; // Track user against this socket
        // console.log(`User ${userId} joined their personal room`);
        
        // Broadcast to others that this user is online
        socket.broadcast.emit("userOnline", userId);
    });

    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        // console.log(`Socket joined conversation ${conversationId}`);
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
        // console.log("User disconnected via Socket.IO");
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

app.use(helmet())


// ========================================
// RATE LIMITING
// ========================================
// Prevent abuse by limiting requests per IP address

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Time window: 15 minutes
    max: 100, // Maximum 100 requests per IP per window
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
})
app.use(limiter)


// ========================================
// COOKIE PARSER MIDDLEWARE
// ========================================
// Parse cookies for httpOnly cookie support

app.use(cookieParser())


// ========================================
// BODY PARSING MIDDLEWARE
// ========================================
// Parse JSON bodies with 10MB limit (for large file uploads)

app.use(express.json({ limit: '10mb' }))
// Parse URL-encoded bodies with 10MB limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }))


// ========================================
// CORS CONFIGURATION
// ========================================
// Configure Cross-Origin Resource Sharing

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-production-domain.com']  // Production: specific domain
        : ['http://localhost:3000'],              // Development: React dev server
    credentials: true,                            // Allow cookies/credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']     // Allowed headers
}))


// ========================================
// ROUTES
// ========================================
// Mount all API routes under root path

app.use("/", IndexRoute)


// ========================================
// ERROR HANDLING
// ========================================
// Global error handler - must be after routes

app.use(customErrorHandler)


// ========================================
// STATIC FILES
// ========================================
// Serve static files (images, etc.) from public directory

app.use(express.static(path.join(__dirname, "public")))


// ========================================
// SERVER STARTUP
// ========================================
const PORT = process.env.PORT || 5000; // Use environment PORT or default to 5000


// Start the server
const server = httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode in server.js`)
    console.log(`API available at: http://localhost:${PORT}`)
    console.log(`Static files at: http://localhost:${PORT}/public`)
})

// ========================================
// ERROR HANDLING FOR UNHANDLED PROMISES
// ========================================
process.on("unhandledRejection", (err, promise) => {
    console.error("Unhandled Promise Rejection:", err, "in server.js");
    
    // Do not crash the server for file upload errors (Cloudinary throws HTTP 400)
    if (err && (err.http_code === 400 || err.message === 'Invalid image file')) {
        console.warn("⚠️ Ignored non-fatal upload promise rejection.");
        return; // Continue running
    }
    
    // Close server and exit process for critical errors
    console.error("FATAL ERROR: Shutting down server...");
    server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
    console.error("🔥 UNCAUGHT EXCEPTION 🔥:");
    console.error(err);
    console.error("FATAL ERROR: Shutting down server...");
    process.exit(1);
});