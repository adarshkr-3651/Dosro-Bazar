import CustomError from "../../Helpers/error/CustomError.js";

const customErrorHandler = (err, req, res, next) => {

    // Handle MongoDB duplicate key error (11000)
    if (err.code == 11000) {
        // Extract the field name from the error
        let field = Object.keys(err.keyPattern || {})[0] || 'field';

        // Get the duplicate value if available
        let value = err.keyValue ? err.keyValue[field] : '';

        // Create user-friendly error messages based on field
        let message = '';
        if (field === 'email') {
            message = `This email address is already registered. Please use a different email or try logging in.`;
        } else if (field === 'username') {
            message = `This username is already taken. Please choose a different username.`;
        } else {
            message = `This ${field} already exists. Please use a different value.`;
        }

        err = new CustomError(message, 409);
    }

    if (err.name === 'SyntaxError') {

        err = new CustomError('Unexpected Sytax ', 400)
    }
    if (err.name === 'ValidationError') {

        err = new CustomError(err.message, 400)
    }

    if (err.name === "CastError") {

        err = new CustomError("Please provide a valid id  ", 400)
    }
    if (err.name === "TokenExpiredError") {

        err = new CustomError("Jwt expired  ", 401)
    }
    if (err.name === "JsonWebTokenError") {
        err = new CustomError("Jwt malformed  ", 401)

    }

    console.log("Custom Error Handler => ", err.name, err.message, err.statusCode)
    console.log("Full Error Object:", err)

    return res.status(err.statusCode || 500)
        .json({
            success: false,
            error: err.message || "Server Error"
        })

}


export default customErrorHandler;
