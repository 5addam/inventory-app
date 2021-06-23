const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        title: {type: String, required: true},
        model: {type: String, required: true},
        summary: {type: String, required: true},
        brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
        item_shape: {type: String, required: true,
            enum: ['Round', 'Rectangle', 'Tank', 'Square', 'Oval', 'Carre']},
        category: [{type: Schema.Types.ObjectId, ref: 'Category', required: true}],
        display_type: {type: String, required: true},
        band_color: {type: String, required: true},
        dial_color: {type: String, required: true},
        price: {type: String, required: true},
        stock: {type: Number, required: true},
        image_url: {type: String, required: true}
    }
);

ProductSchema
.virtual('url')
.get(function(){
    return '/product/' + this.model;
});

module.exports = mongoose.model('Product', ProductSchema)
