const User = require('../model/user')
const jwt = require('jsonwebtoken')

const Token = require('../model/token')
const crypto = require('crypto')

const sendEmail = require('../utils/setEmail')
const { memoryStorage } = require('multer')

const expressJwt = require('express-jwt')


// user register
exports.userRegister = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    User.findOne({ email: user.email }, async (error, data) => {
        if (data == null) {
            user = await user.save()
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: user._id
            })
            token = await token.save()
            if (!token) {
                return res.status(400).json({ error: "token couldn't be saved" })
            }
            const url = process.env.FRONTEND_URL+`\/email\/confirmation\/`+token.token
            sendEmail({
                from: 'noreply@mystore.com',
                to: user.email,
                subject: 'Verification email',
                text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/user\/confirmation\/${token.token}`,
                html: `<h1>Verify your email </h1>
                <button><a href='${url}'>Verify Email</a></button>`
            })

            if (!user) {
                return res.status(400).json({ error: "something went wrong" })
            }
            else {
                res.send(user)
            }
        }
        else {
            return res.status(400).json({ error: "User already exists." })
        }
    })


}

// user sign in process
exports.userSignin = async (req, res) => {
    //check if email is registered or not
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ error: "email is not registered" })
    }

    //if user is registered check password
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "Email and password does not match" })
    }
    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: " Please verify your email first to continue." })
    }

    //generate token using user id and jwt
    const token = jwt.sign({ _id: user._id, user: user.role }, process.env.JWT_SECRET)

    res.cookie('myCookie', token, { expire: Date.now() + 999999 })
    // return information to the frontend
    const { _id, name, isAdmin } = user
    return res.json({ token, user: { name, email, isAdmin, _id } })
}

// user sign out
exports.userSignout = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: "Successfully signed out" })
}

//verify user
exports.emailVerification = (req, res) => {
    // validate token
    Token.findOne({ token: req.params.token }, (error, token) => {
        // if not validate, return error
        if (error || !token) {
            return res.status(400).json({ error: "invalid token" })
        }
        // valid token -> find user -> isVerified
        User.findOne({ _id: token.userId }, (error, user) => {
            if (error || !user) {
                return res.status(400).json({ error: "User not found" })
            }


            if (user.isVerified) {
                return res.status(400).json({ error: "User already verified, Please log in to continue" })
            }
            user.isVerified = true
            user.save()
            return res.json({ message: "Your account has been verified." })
        })
    })
}

//resend Verification mail
exports.resendVerificationMail = async (req, res) => {
    //find user
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "User not found." })
    }
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified, Login to continue" })
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "token couldn't be saved" })
    }
    sendEmail({
        from: 'noreply@mystore.com',
        to: user.email,
        subject: 'Verification email',
        text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/user\/confirmation\/${token.token}`,
        html: `<h1>Verify your email </h1>`
    })
    res.json({ message: "Verification Link has been sent to your email" })
}


//forget password
exports.forgetPassword = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "User not found." })
    }
    let token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    token=await token.save()
    if (!token) {
        return res.status(400).json({ error: "Token could not be generated." })
    }
    const url = process.env.FRONTEND_URL+`\/user\/resetpassword\/`+token.token
    sendEmail({
        from: 'noreply@mystore.com',
        to: user.email,
        subject: 'Password Reset link',
        text: ` \n Please click on the following link to reset your password.
        \n http:\/\/${req.headers.host}\/user\/resetpassword\/${token.token}`,
        html: `<h1>Reset your password. </h1>
        <button className="btn btn-primary"><a href='${url}'>Reset Password</a></button>`
    })
    res.json({ message: "Password reset link has been sent to your email" })

}

//reset password
exports.resetPassword = async (req,res) =>{
    //check if the token is valid
    let token = await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:'invalid token'})
    }
    //find user for valid token
    let user = await User.findOne({
        _id:token.userId,
        email: req.body.email
    })
    if(!user){
        return res.status(400).json({error:"user not found"})
    }
    //update password if user is found
    user.password=req.body.password
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"unable to update password"})
    }
    res.json({message:"Password has been reset successfully"})
}

// view user list
exports.userList = async (req,res) =>{
    const user = await User.find().select('-hashed_password')
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(user)
}

// find user, view user details
exports.viewUserDetails = async (req,res) =>{
    const user = await User.findById(req.params.id).select('-hashed_password -salt')
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(user)
}

//require signin
exports.requireSignIn = expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty: 'auth'

})

