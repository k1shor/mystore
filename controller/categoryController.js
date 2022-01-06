const Category = require('../model/category')

// exports.welcome=(req,res)=>{
//     res.send("Welcome to express js.")
// }

// to insert data in category
exports.addCategory = async (req, res) => {
    let category = new Category(req.body)
    Category.findOne({ category_name: category.category_name }, async (error, data) => {
        if (data == null) {
            if (!category) {
                return res.status(400).json({ error: "something went wrong" })
            }
            else {
                res.send(category)
            }
            category = await category.save()
        }
        else {
            return res.status(400).json({ error: 'Category already exists. Category must be unique.' })
        }
    })
}

// to show all categories
exports.showCategories = async (req, res) => {
    let category = await Category.find()
    if (!category) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(category)
    }
}


// to find a category
exports.findCategory = async (req,res) => {
    let category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(category)
    }
}


// to update a category
exports.updateCategory = async(req,res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {category_name:req.body.category_name},
        {new:true}
    )
    if (!category) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(category)
    }
}


//to delete a category
exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category => {
        if(!category){
            return res.status(400).json({error:"Something went wrong"})
        }
        else{
            return res.status(200).json({message:"category deleted successfully"})
        }
    }

    )
    .catch(err => res.status(400).json({error:err}))
}
