const OrderItem = require('../model/orderItem')
const Order = require('../model/order')

exports.placeOrder = async (req,res) =>{
    const orderItemsId = await Promise.all(req.body.orderItems.map( async(orderItem)=>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save()
        return newOrderItem._id
    }))
    // const orderItemsIdResolved = await orderItemsId

    // calculating total price
    const totalindividualPrice= await Promise.all(orderItemsId.map(async (orderItemId)=>{
        const itemOrder = await OrderItem.findById(orderItemId).populate('product','product_price')
        const total = itemOrder.quantity * itemOrder.product.product_price
        return total
    }))
    const TotalPrice=totalindividualPrice.reduce((a,b)=>a+b)

    let order = new Order({
        OrderItems:orderItemsId,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zipcode:req.body.zipcode,
        country:req.body.country,
        phone:req.body.phone,
        totalPrice:TotalPrice,
        user:req.body.user
    })
    order = await order.save()
    if(!order){
        return res.status(400).json({error:"the order could not be completed"})
    }
    res.send(order)
}

// view orders
exports.orderList = async (req,res) =>{
    const order = await Order.find().populate('user','name')
    .sort({createAt:-1})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}
// view order details
exports.orderDetails = async (req,res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({path:'OrderItems',populate:{path:'product',populate:'category'}})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// view user order
exports.userOrders = async (req,res) =>{
    const userOrderList = await Order.find({user:req.params.userid})
    .populate({path:'OrderItems',populate:{path:'product',populate:'category'}})
    .sort({createdAt:-1})
    if(!userOrderList){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(userOrderList)
}

//update order
exports.updateOrder = async(req,res) =>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        },
        {new:true}
    )
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// delete order
exports.deleteOrder = (req,res) =>{
    Order.findByIdAndRemove(req.params.id)
    .then(async order =>{
        if(order){
            await order.OrderItems.map(async orderItem =>{
                await orderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({message:"Order deleted successfully"})
        }
        else{
            return res.status(400).json({error: "failed to delete order"})
        }     
    })
    .catch(error=>{
        return res.status(400).json({error:error})
    })
}