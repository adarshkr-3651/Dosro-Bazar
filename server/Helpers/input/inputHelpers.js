const bcrypt = require("bcryptjs")

const validateUserInput = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    
    return emailRegex.test(email) && passwordRegex.test(password);
}

const comparePassword =  (password , hashedPassword) =>{

    return  bcrypt.compareSync(password,hashedPassword)

}

module.exports ={
    validateUserInput,
    comparePassword
}