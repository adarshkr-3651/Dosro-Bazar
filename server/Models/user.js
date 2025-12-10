// ========================================
// USER MODEL
// Defines the User schema and methods for authentication and password reset
// ========================================

// Import required modules
const crypto = require("crypto")    // For generating secure random tokens
const mongoose = require("mongoose") // MongoDB object modeling
const bcrypt = require("bcryptjs")   // For password hashing
const jwt = require("jsonwebtoken")  // For JWT token generation

console.log("User model module loaded in Models user.js")

// ========================================
// USER SCHEMA DEFINITION
// ========================================
const UserSchema = new mongoose.Schema({
    // Basic user information
    username : {
        type :String,
        required : [true ,"Please provide a username"]
    },
    
    // User profile photo
    photo : {
        type : String,
        default : "user.png"  // Default profile picture
    },
    
    // User email (unique identifier)
    email : {
        type: String ,
        required : [true ,"Please provide a email"],
        unique : true ,  // Ensure email uniqueness
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    
    // User password (hashed)
    password : {
        type:String,
        minlength: [6, "Please provide a password with min length : 6 "],
        required: [true, "Please provide a password"],
        select: false  // Don't include password in queries by default
    },
    
    // User role (user or admin)
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]  // Only allow these roles
    },
    
    // User's reading list (array of story IDs)
    readList : [{
        type : mongoose.Schema.ObjectId, 
        ref : "Story"  // Reference to Story model
    }],
    
    // Count of items in reading list
    readListLength: {
        type: Number,
        default: 0
    },
    
    // Password reset token (for forgot password functionality)
    resetPasswordToken : String ,
    
    // Password reset token expiration time
    resetPasswordExpire: Date 

}, {timestamps: true})  // Automatically add createdAt and updatedAt fields

// ========================================
// PRE-SAVE MIDDLEWARE
// ========================================
// Hash password before saving to database
UserSchema.pre("save" , async function (next) {
    console.log("pre-save hook function of Models user.js")
    console.log("[user.js] pre-save() - Hashing password for user:", this.email)
    // Only hash password if it has been modified
    if (!this.isModified("password")) {
        console.log("[user.js] pre-save() - Password not modified, skipping hash.")
        next()
    }

    // Generate salt for password hashing
    const salt = await bcrypt.genSalt(10)
    
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password,salt)
    console.log("[user.js] pre-save() - Password hashed successfully.")
    next() ;
})

// ========================================
// JWT TOKEN GENERATION METHOD
// ========================================
// Generate JWT token for user authentication
UserSchema.methods.generateJwtFromUser  = function(){
    console.log("generateJwtFromUser function of Models user.js")
    console.log("[user.js] generateJwtFromUser() - Generating JWT for user:", this.email)
    // Get JWT configuration from environment variables
    const { JWT_SECRET_KEY,JWT_EXPIRE } = process.env;

    // Create JWT payload with user information
    payload = {
        id: this._id,           // User ID
        username : this.username, // Username
        email : this.email      // Email
    }

    // Sign the token with secret key and expiration
    const token = jwt.sign(payload ,JWT_SECRET_KEY, {expiresIn :JWT_EXPIRE} )
    console.log("[user.js] generateJwtFromUser() - JWT token generated.")
    return token 
}

// ========================================
// PASSWORD RESET TOKEN GENERATION METHOD
// ========================================
// Generate secure token for password reset
UserSchema.methods.getResetPasswordTokenFromUser =function(){
    console.log("getResetPasswordTokenFromUser function of Models user.js")
    console.log("[user.js] getResetPasswordTokenFromUser() - Generating reset password token for user:", this.email)
    // Get reset password expiration time from environment
    const { RESET_PASSWORD_EXPIRE } = process.env

    // Generate random hex string
    const randomHexString = crypto.randomBytes(20).toString("hex")

    // Create hash of the random string for security
    const resetPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest("hex")

    // Set reset token and expiration on user document
    this.resetPasswordToken = resetPasswordToken
    this.resetPasswordExpire =Date.now()+ parseInt(RESET_PASSWORD_EXPIRE)
    console.log("[user.js] getResetPasswordTokenFromUser() - Reset password token generated and expiry set.")
    return resetPasswordToken
}

// ========================================
// CREATE AND EXPORT USER MODEL
// ========================================
const User = mongoose.model("User",UserSchema)

module.exports = User  ;