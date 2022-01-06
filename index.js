const express=require('express')
require('dotenv').config()

const app=express()
const CategoryRoute=require('./route/categoryRoute')
const ProductRoute=require('./route/productRoute')
const UserRoute = require('./route/userRoute')

const db=require('./database/connection')
const bodyParser =require('body-parser')
const morgan=require('morgan')
const expressValidator=require('express-validator')
const cookieParser = require('cookie-parser')

//middleware
app.use(bodyParser.json())
app.use('/public/uploads',express.static('public/uploads'))

// app.get('/',(req,res)=>{
//     res.send('Welcome to express !!!')
// })

app.use(morgan('dev'))
app.use(expressValidator())
app.use(cookieParser())

//routes
app.use('/category',CategoryRoute)
app.use('/products',ProductRoute)
app.use('/user',UserRoute)

const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})