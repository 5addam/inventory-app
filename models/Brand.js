const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
    {
        name: {type: String, required: true},
        about: {type: String, required: true},
        founders: {type: String, required: true},
        headquarters: {type: String, required: true},
        image_url: {type: String, required: true},
        website_url: {type: String, required: true}
    }
);


// Virtual for brand's url
BrandSchema
.virtual('url')
.get(function(){
    return '/brand/' + this._id;
});

module.exports = mongoose.model('Brand', BrandSchema)