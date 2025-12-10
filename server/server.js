// ========================================
// MERN BLOG BACKEND SERVER - MAIN ENTRY POINT
// ========================================

console.log("Starting MERN Blog Backend Server... in server.js")

// Import required packages
const express = require("express")           // Web framework for Node.js
const dotenv = require("dotenv")             // Load environment variables from .env file
const cors = require("cors")                 // Enable Cross-Origin Resource Sharing
const path = require("path")                 // File path utilities
const rateLimit = require("express-rate-limit") // Rate limiting middleware
const helmet = require("helmet")             // Security headers middleware

console.log("All packages imported successfully in server.js")

// Import custom modules
const IndexRoute = require("./Routers/index")                    // Main router that handles all API routes
const connectDatabase = require("./Helpers/database/connectDatabase") // Database connection helper
const customErrorHandler = require("./Middlewares/Errors/customErrorHandler") // Global error handler

console.log("Custom modules imported successfully in server.js")

// ========================================
// ENVIRONMENT CONFIGURATION
// ========================================
// Load environment variables from config.env file
console.log("Loading environment configuration... in server.js")
dotenv.config({
    path:  './Config/config.env'
})
console.log("Environment variables loaded in server.js")

// ========================================
// DATABASE CONNECTION
// ========================================
// Connect to MongoDB database
console.log("Connecting to database... in server.js")
connectDatabase()

// ========================================
// EXPRESS APP INITIALIZATION
// ========================================
console.log("Initializing Express app... in server.js")
const app = express() ;
console.log("Express app initialized in server.js")

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
console.log("CORS configured for:", process.env.NODE_ENV === 'production' ? 'production' : 'development' , "in server.js")

// ========================================
// ROUTES
// ========================================
// Mount all API routes under root path
console.log("Setting up API routes... in server.js")
app.use("/",IndexRoute)
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
app.use(express.static(path.join(__dirname , "public") ))
console.log("Static files configured from public directory in server.js")

// ========================================
// SERVER STARTUP
// ========================================
const PORT = process.env.PORT || 5000 ; // Use environment PORT or default to 5000
console.log(`Starting server on port ${PORT}... in server.js`)

// Start the server
const server = app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode in server.js`)
    console.log(`API available at: http://localhost:${PORT}`)
    console.log(`Static files at: http://localhost:${PORT}/public`)
})

// ========================================
// ERROR HANDLING FOR UNHANDLED PROMISES
// ========================================
// Gracefully handle unhandled promise rejections
process.on("unhandledRejection",(err , promise) =>{
    console.log("Unhandled Promise Rejection:", err , "in server.js")
    // Close server and exit process
    server.close(()=>process.exit(1))
})