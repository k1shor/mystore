const express = require('express')
const { userRegister, userSignin, userSignout, emailVerification, resendVerificationMail, forgetPassword, resetPassword, userList, viewUserDetails, requireSignIn } = require('../controller/userController')
const { userValidation } = require('../validation')

const router = express.Router()


router.post('/register',userValidation, userRegister)
router.post('/signin',userSignin)
router.post('/signout',userSignout)
router.post('/confirmation/:token',emailVerification)
router.post('/resendVerificationLink',resendVerificationMail)
router.post('/forgetpassword',forgetPassword)
router.put('/resetpassword/:token',resetPassword)
router.get('/userlist',requireSignIn, userList)
router.get('/userDetails/:id',requireSignIn,viewUserDetails)


module.exports=router