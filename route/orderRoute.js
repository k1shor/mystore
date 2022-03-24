const express = require('express')
const { placeOrder, orderList, orderDetails, userOrders, updateOrder, deleteOrder } = require('../controller/orderController')
const router = express.Router()

router.post('/placeorder',placeOrder)
router.get('/orderList',orderList)
router.get('/orderdetails/:id',orderDetails)
router.get('/userorder/:userid',userOrders)
router.put('/updateorder/:id',updateOrder)
router.delete('/deleteorder/:id',deleteOrder)

module.exports = router