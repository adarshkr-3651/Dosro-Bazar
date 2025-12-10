const CustomError = require("../../Helpers/error/CustomError");
const User = require("../../Models/user")
const jwt = require("jsonwebtoken");
const asyncErrorWrapper =require("express-async-handler")
const { isTokenIncluded ,getAccessTokenFromHeader} = require("../../Helpers/auth/tokenHelpers");


const getAccessToRoute = asyncErrorWrapper(async(req,res,next) =>{

    const {JWT_SECRET_KEY} =process.env ;

    if(!isTokenIncluded(req)) {

        return next(new CustomError("You are not authorized to access this route ", 401))
    }

    const accessToken = getAccessTokenFromHeader(req)
    console.log("accessToken function of Middlewares auth.js", accessToken)
    console.log("JWT_SECRET_KEY function of Middlewares auth.js", JWT_SECRET_KEY)
    const decoded = jwt.verify(accessToken,JWT_SECRET_KEY) ;
    console.log("getAccessToRoute function of Middlewares auth.js", decoded)
    const user = await User.findById(decoded.id)
   
    if(!user) {
        return next(new CustomError("You are not authorized to access this route ", 401))
    }

    req.user = user ; 

    next()

})



module.exports ={getAccessToRoute}