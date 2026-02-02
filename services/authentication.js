const JWT = require("jsonwebtoken")
const user = require("../models/user")
const secret = "$uperman@123"

function createTokenforUser(user){
    const payload={
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileImageurl:user.profileImage,
        role:user.role
    }
    const token=JWT.sign(payload,secret);
    return token
}

function validateToken(token){
    const payload = JWT.verify(token,secret)
    return payload
}


module.exports={
    createTokenforUser,
    validateToken
}