const Brand = require('../models/Brand');
const Product = require('../models/Product');
const async = require('async');

// Display all Brands.
exports.all_brands = function (req, res) {

    Brand.find()
        .sort([
            ['name', 'ascending']
        ])
        .exec(function (err, list_brands) {
            if (err) {
                return next(err);
            }

            // Successful, so render.
            res.render('brand_list', {
                title: 'List of Brands',
                brand_list: list_brands
            });
        });
};

// Detail page for a specific Brand.
exports.brand_detail = function (req, res, next) {

    async.parallel({
        brand: function (callback) {
            Brand.findById(req.params.id)
                .exec(callback)
        },
        brand_products: function (callback) {
            Product.find({
                    'brand': req.params.id
                }, 'model brand price image_url')
                .populate('brand')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }

        if (results.brand == null) { // No result
            const err = new Error('Brand not found.');
            err.status = 404;
            return next(err);
        }
        // Success. So, render
        res.render('brand_detail', {
            title: 'Brand Details',
            brand: results.brand,
            products: results.brand_products
        });
    });
};

// Display brand create form on GET
exports.brand_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: GET brand create form.');
};

// Handle brand create form on POST
exports.brand_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: POST brand create form.');
};

// Display brand delete form on GET
exports.brand_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: GET brand delete form.');
};

// Handle brand delete form on POST
exports.brand_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: POST brand delete form.');
};

// Display brand update form on GET
exports.brand_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: GET brand update form.');
};

// Handle brand update form on POST
exports.brand_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: POST brand update form.');
};