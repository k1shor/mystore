const Product = require('../model/product')

// to store product in database
exports.addProduct = async (req, res) => {
    let product = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        countInStock: req.body.countInStock,
        product_description: req.body.product_description,
        product_image: req.file.path,
        category: req.body.category
    })
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
    product = await product.save()
}


// to show product list
exports.productList = async (req, res) => {

    let order= req.query.order ? req.query.order:'asc'
    let sortBy = req.query.order ? req.query.sortBy: '_id'
    let limit = req.query.order ? parseInt(req.query.limit) : 200

    let product = await Product.find().populate('category')
   
    .sort([[sortBy,order]])
    .limit(limit)
   
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to show product details
exports.productDetails = async (req, res) => {
    let product = await Product.findById(req.params.Id).populate('category')
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to update product
exports.updateProduct = async (req, res) => {
    let product = await Product.findByIdAndUpdate(req.params.Id, {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        countInStock: req.body.countInStock,
        product_description: req.body.product_description,
        product_image: req.file.path,
        category: req.body.category
    }, { new: true })
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to delete product
exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.Id)
        .then(product => {
            if (!product) {
                return res.status(400).json({ error: "product not found" })
            }
            else {
                return res.status(200).json({ message: "Product deleted successfully" })
            }
        })

        .catch(err => {
            return res.status(400).json({ error: err })
        })

}

// to list related products from same category
exports.listRelated = async (req,res) => {
    console.log("back")
    let single_product = await Product.findById(req.params.Id)
    console.log(single_product)
    let product = await Product.find({_id:{$ne:single_product},category:single_product.category})
    .populate('category','category_name')
    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
}

// to filter product by category and price range
exports.filterProduct = async(req,res)=>{
    let order = req.body.order ? req.body.order:'desc'
    let sortBy = req.body.sortBy? req.body.sort: '_id'
    let limit = req.body.limit ? parseInt(req.body.limit): 20
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    for(let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key==="product_price"){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else{
                findArgs[key]=req.body.filters[key]
            }
        }
    }

    const product = await Product.find(findArgs)
    // .populate('category')
    // .sort([[sortBy,order]])
    // .limit(limit)
    // .skip(skip)
    
    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
}

