const express=require('express')
const { addCategory, showCategories, findCategory, updateCategory, deleteCategory } = require('../controller/categoryController')
const { requireSignIn } = require('../controller/userController')
const router=express.Router()


// router.get('/welcome',welcome)

// category route
router.post('/addcategory',requireSignIn, addCategory)
router.get('/categories',showCategories)
router.get('/findcategory/:id',findCategory)
router.put('/updatecategory/:id',requireSignIn, updateCategory)
router.delete('/deletecategory/:id',requireSignIn, deleteCategory)
module.exports = router