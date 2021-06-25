const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

const async = require('async');
const {
    body,
    validationResult
} = require('express-validator');

// index page
exports.index = function (req, res, next) {
    res.send('Home page');
}

// Display all of the products
exports.all_products = function (req, res) {
    Product.find({}, 'model price image_url')
        .populate('brand')
        .exec(function (err, list_products) {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.render('product_list', {
                title: 'Products',
                product_list: list_products
            });
        });

};

// Detail page for a specific product
exports.product_detail = function (req, res) {
    Product.findOne({
            'model': req.params.model
        })
        .populate('brand')
        .populate('category')
        .exec(function (err, product) {
            if (err) {
                return next(err);
            }
            if (product == null) { //No result
                var err = new Error('Product not found!!');
                err.status = 404;
                return next(err);
            }
            product.dial_color = product.dial_color.replace('&#x2F;', '/');
            // product.image_url = product.image_url.replace('&#x2F;','/');
            // Successful. So, render
            res.render('product_detail', {
                title: 'Product Detail',
                product: product
            });
        })
};

// Display product create form on GET
exports.product_create_get = function (req, res) {

    //Get all brands and categories, which we need for our new product
    async.parallel({
        brands: function (callback) {
            Brand.find(callback);
        },
        categories: function (callback) {
            Category.find(callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        // Success. So, render.
        res.render('product_form', {
            title: 'Add New Product',
            brands: results.brands,
            categories: results.categories
        });
    });
};

// Handle product create on POST
exports.product_create_post = [

    // Convert the category to an array.
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined')
                req.body.categories = [];
            else
                req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate and sanitize fields
    body('title', 'Title must not be empty.').trim().isLength({
        min: 5
    }).escape(),
    body('model', 'Model must not be empty').trim().isLength({
        min: 1
    }).escape(),
    body('summary', 'Summary must contain at least 10 characters.').trim().isLength({
        min: 10
    }).escape(),
    body('display_type').trim().isLength({
        min: 1
    }).escape().withMessage('Display type must be specified'),
    // onlyy letters and whitespaces allowed
    // .matches(/^[A-Za-z\s]$/).withMessage('Display type must contain only letters'),
    body('dial_color').trim().isLength({
        min: 1
    }).escape().withMessage('Dail color must be specified (must contain 3 or more characters)'),
    // .matches(/^[A-Za-z\s]$/).withMessage('Dial color must contain only letters'),
    body('band_color').trim().isLength({
        min: 1
    }).escape().withMessage('Band color must be specified (must contain 3 or more characters)'),
    // .matches(/^[A-Za-z\s]$/).withMessage('Dial color must contain only letters'),
    body('price').trim().isLength({
        min: 1
    }).escape().withMessage('Product price must be specified.'),
    // .matches(/^[0-9.,]$/).withMessage('Price must contain number and special-characters(dot(.) and comma(,) only)'),
    body('stock').trim().isLength({
        min: 1
    }).escape().withMessage('Stock must be must be specified.')
    .isNumeric().withMessage('Stock must contain numbers only'),
    body('image_url').trim().isLength({
        min: 1
    }).withMessage('Image URL must be must be specified.')
    .isURL().withMessage('Please provide a proper url.'),
    body('category.*').escape(),

    // Process req after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from the req.
        const errors = validationResult(req);

        // Create a Product object and escaped and trimmed data.
        var product = new Product({
            title: req.body.title,
            model: req.body.model,
            summary: req.body.summary,
            brand: req.body.brand,
            item_shape: req.body.dial_shape,
            category: req.body.category,
            display_type: req.body.display_type,
            band_color: req.body.band_color,
            dial_color: req.body.dial_color,
            price: req.body.price,
            stock: req.body.stock,
            image_url: req.body.image_url
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/errors messages.

            // Get all brands and categories
            async.parallel({
                brands: function (callback) {
                    Brand.find(callback);
                },
                categories: function (callback) {
                    Category.find(callback);
                },
            }, function (err, results) {
                if (err) {
                    return next(err);
                }

                // Mark our selected categories as checked.
                for (let i = 0; i < results.categories.length; i++) {
                    if (product.category.indexOf(results.categories[i]._id) > -1) {
                        results.categories[i].checked = 'true';
                    }
                }
                res.render('product_form', {
                    title: 'Add New Product',
                    brands: results.brands,
                    categories: results.categories,
                    product: product,
                    errors: errors.array()
                });
                return;
            });
        } else {
            // Form data is valid

            // Check if proudct already exists
            Product.findOne({
                    'model': product.model
                })
                .exec(function (err, old_product) {
                    if (err) {
                        return next(err);
                    }
                    if (old_product == null) {
                        // Product does not already exists
                        // So, save the product
                        product.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                            // Successful - redirect to new product detail page
                            res.redirect(product.url);
                        });
                        return;
                    }
                    // product already exits
                    // so don't save
                    var err = new Error('Product already exits in the database!!');
                    // err.status = 404;
                    return next(err);

                })
            // product.save(function (err) {
            //     if (err) {
            //         return next(err);
            //     }
            //     // Successful - redirect to new product detail page
            //     res.redirect(product.url);
            // });
        }
    }
];

// Display product delete form on GET
exports.product_delete_get = function (req, res) {
    res.send('Delete product GET method is not implemented yet');
};

// Handle product delete on POST
exports.product_delete_post = function (req, res) {
    res.send('Delete product POST method is not implemented yet');
};

// Display product update form on GET.
exports.product_update_get = function (req, res) {

    // Get product, brands, and categories for the update form

};

// Handle product update on POST
exports.product_update_post = function (req, res) {
    res.send('Update product POST method is not implemented yet');
};