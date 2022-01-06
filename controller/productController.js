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
    let product = await Product.find().populate('category')
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