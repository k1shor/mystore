const express = require('express')
const { processPayment, sendStripeApi } = require('../controller/paymentContoller')
const { requireSignIn } = require('../controller/userController')

const router = express.Router()


router.post('/process/payment', requireSignIn, processPayment)
router.get('/stripeapi', sendStripeApi)


module.exports = router