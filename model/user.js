const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    hashed_password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    salt: String
}, { timestamps: true })


//virtual field
userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

//defining method
userSchema.methods = {
    authenticate: function (plaintext){
        return this.encryptPassword(plaintext)===this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) {
            return ''
        }
        try {
            return crypto
                .createHmac('sha256', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (err) {
            return ''
        }
    }
}

module.exports = mongoose.model('User', userSchema)
