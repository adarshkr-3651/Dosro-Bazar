const asyncErrorWrapper = require("express-async-handler")
const User = require("../Models/user");
const CustomError = require("../Helpers/error/CustomError");
const { sendToken } = require("../Helpers/auth/tokenHelpers");
const sendEmail = require("../Helpers/Libraries/sendEmail");
const { validateUserInput,comparePassword } = require("../Helpers/input/inputHelpers");

const getPrivateData = asyncErrorWrapper((req,res,next) =>{
    console.log("getPrivateData function of Controllers auth.js")
    console.log("[auth.js] getPrivateData() - User from middleware:", req.user ? req.user.email : "No user")
    
    console.log("[auth.js] getPrivateData() - Token validation successful")
    return res.status(200).json({
        success:true ,
        message : "You got access to the private data in this route ",
        user : req.user
    })
})

const register = asyncErrorWrapper (async  (req,res,next) => {
    console.log("register function of Controllers auth.js")
    
    const { username,email , password} = req.body  ;
    console.log("[auth.js] register() - Registration data:", { username, email, passwordLength: password?.length })
    
    console.log("[auth.js] register() - Creating new user in database...")
    const newUser = await User.create({
        username,
        email,
        password
    })
    
    console.log("[auth.js] register() - User created successfully:", newUser.email)
    
    console.log("[auth.js] register() - Generating JWT token...")
    sendToken(newUser ,201,res)
    console.log("[auth.js] register() - Registration completed successfully")
})

const login  = asyncErrorWrapper (async(req,res,next) => {
    console.log("login function of Controllers auth.js")
    
    const {email,password} = req.body 
    console.log("[auth.js] login() - Login attempt for email:", email)
    
    if(!validateUserInput(email,password)) {
        console.log("[auth.js] login() - Input validation failed")
        return next(new CustomError("Please check your inputs",400))
    }
    console.log("[auth.js] login() - Input validation passed")

    console.log("[auth.js] login() - Searching for user in database...")
    const user = await User.findOne({email}).select("+password")

    if(!user) {
        console.log("[auth.js] login() - User not found:", email)
        return next(new CustomError("Invalid credentials",404))
    }
    console.log("[auth.js] login() - User found:", user.email)

    console.log("[auth.js] login() - Comparing passwords...")
    if(!comparePassword(password,user.password)){
        console.log("[auth.js] login() - Password comparison failed")
        return next(new CustomError("Please check your credentials",404))
    }
    console.log("[auth.js] login() - Password comparison successful")

    console.log("[auth.js] login() - Generating JWT token...")
    sendToken(user ,200,res)  ;
    console.log("[auth.js] login() - Login completed successfully")
})




const forgotpassword  = asyncErrorWrapper( async (req,res,next) => {
    const {URI,EMAIL_USERNAME} = process.env ; 
    console.log("forgotpassword function of Controllers auth.js")
    const resetEmail = req.body.email  ;

    const user = await User.findOne({email : resetEmail})

    if(!user ) {
        return next(new CustomError( "There is no user with that email",400))
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save()  ;

    const resetPasswordUrl = `${URI}/resetpassword?resetPasswordToken=${resetPasswordToken}`

    const emailTemplate = `
    <h3 style="color : red "> Reset Your Password </h3>
    <p> This <a href=${resetPasswordUrl}   
     target='_blank'  >Link </a> will expire in 1 hours </p> 
    `;

    try {

        sendEmail({
            from: EMAIL_USERNAME,
            to: resetEmail, 
            subject: " ✔ Reset Your Password  ✔", 
            html: emailTemplate
        })

        return res.status(200)
        .json({
            success: true,
            message: "Email Send"
        })

    }

    catch(error ) {

        user.resetPasswordToken = undefined ;
        user.resetPasswordExpire = undefined  ;

        await user.save();
   
        return next(new CustomError('Email could not be send ', 500))
    }



})


const resetpassword  =asyncErrorWrapper(  async (req,res,next) => {

    console.log("resetpassword function of Controllers auth.js")
    const newPassword = req.body.newPassword || req.body.password

    const {resetPasswordToken} = req.query

    if(!resetPasswordToken) {

        return next(new CustomError("Please provide a valid token ",400))
    }

    const user = await User.findOne({

        resetPasswordToken :resetPasswordToken ,
        resetPasswordExpire : { $gt: Date.now() }

    })
    
    if(!user) {
        return next(new CustomError("Invalid token or Session Expired" ,400))
    }


    user.password = newPassword ; 

    user.resetPasswordToken = undefined 
    user.resetPasswordExpire = undefined

    await user.save() ; 

    return res.status(200).json({
        success :true ,
        message : "Reset Password access successfull"
    })

})


module.exports ={
    register,
    login,
    resetpassword,
    forgotpassword,
    getPrivateData
}