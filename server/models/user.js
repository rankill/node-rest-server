const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required buddy'] 
    },
    email: {
        type: String,
        required: [true, 'Email is required buddy'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required buddy'] 
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    const user = this;
    let userObject = user.toObject();

    delete userObject.password

    return userObject
}

userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});


module.exports = mongoose.model('User', userSchema)