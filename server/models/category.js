const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


let categoriesSchema = new Schema({
    description: {type: String, unique: true, required: [true, 'Category description']},
    user: { type: Schema.ObjectId, ref: 'User'},
    status: {
        type: Boolean,
        required: true,
        default: true
    },
})

categoriesSchema.methods.toJSON = function() {
    const category = this;
    let categoryObject = category.toObject();

    return categoryObject
}

categoriesSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});


module.exports = mongoose.model('Category', categoriesSchema)