const express=require('express')
const { addProduct, productList, productDetails, updateProduct, deleteProduct, listRelated, filterProduct } = require('../controller/productController')
const { requireSignIn } = require('../controller/userController')
const router=express.Router()
const upload=require('../middleware/file-upload')
const { productValidation } = require('../validation')

router.post('/postproduct',requireSignIn, upload.single('product_image'),productValidation, addProduct)
router.get('/productlist',productList)
router.get('/productdetails/:Id',productDetails)
router.put('/updateproduct/:Id',requireSignIn,updateProduct)
router.delete('/deleteproduct/:Id',requireSignIn,deleteProduct)
router.get('/product/related/:Id',listRelated)
router.post('/filterproduct', filterProduct)



module.exports=router
