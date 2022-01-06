exports.productValidation = (req, res, next) => {
    req.check('product_name', 'Product name is required').notEmpty()
    req.check('product_price', 'Product price is required').notEmpty()
        .isNumeric()
        .withMessage('Price must be only numbers')
    req.check('countInStock', 'Stock value is required').notEmpty()
        .isNumeric()
        .withMessage('Stock should be only numbers')
    req.check('product_description', 'Description is required').notEmpty()
        .isLength({
            min: 20
        })
        .withMessage('Description must be more than 20 characters')
    req.check('category', 'Category is required').notEmpty()

    const errors = req.validationErrors()

    if (errors) {
        const showError = errors.map(err => err.msg)[0]
        return res.status(400).json({ error: showError })
    }

    next()

}

exports.userValidation = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('email', 'Email is required').notEmpty()
        .isEmail()
        .withMessage('Email format incorrect')
    req.check('password', 'Password is required').notEmpty()
        .isLength({
            min:8,
            max:30
        })
        .withMessage('Password must be minimum 8 characters and maximum 30 characters')

    const errors = req.validationErrors()

    if (errors) {
        const showError = errors.map(err => err.msg)[0]
        return res.status(400).json({ error: showError })
    }

    next()

}