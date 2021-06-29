const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    }
});

CategorySchema
    .virtual('url')
    .get(function () {
        return '/category/' + this.name;
    });

CategorySchema
    .virtual('edit_url')
    .get(function () {
        return '/category/' + this.id;
    });

module.exports = mongoose.model('Category', CategorySchema)