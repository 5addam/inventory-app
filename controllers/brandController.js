const Brand = require('../models/Brand');
const Product = require('../models/Product');
const async = require('async');
const {
    body,
    validationResult
} = require('express-validator');


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

    // async.parallel({
    //     brand: function (callback) {
    //         Brand.findOne({'name':req.params.name})
    //             .exec(callback)
    //     },
    //     brand_products: function (callback) {
    //         Product.find({
    //                 'brand': req.params.id
    //             }, 'model brand price image_url')
    //             .populate('brand')
    //             .exec(callback)
    //     },
    // }, function (err, results) {
    //     if (err) {
    //         return next(err);
    //     }

    //     if (results.brand == null) { // No result
    //         const err = new Error('Brand not found.');
    //         err.status = 404;
    //         return next(err);
    //     }
    //     // Success. So, render
    //     res.render('brand_detail', {
    //         title: 'Brand Details',
    //         brand: results.brand,
    //         products: results.brand_products
    //     });
    // });
    var my_brand;
    async.waterfall([
        function (callback) {
            Brand.findOne({
                    'name': req.params.name
                })
                .exec(callback)
        },
        function (brand, callback) {
            if (brand == null) {
                const err = new Error('Brand not found.');
                err.status = 404;
                return next(err);
            }
            my_brand = brand;
            Product.find({
                    'brand': brand._id
                }, 'model brand price image_url')
                .populate('brand')
                .exec(callback)
        },
    ], function (err, results) {
        if (err) {
            return next(err);
        }
        // console.log(results);

        // if (brand == null) { // No result
        //     const err = new Error('Brand not found.');
        //     err.status = 404;
        //     return next(err);
        // }
        // Success. So, render
        res.render('brand_detail', {
            title: 'Brand Details',
            brand: my_brand,
            products: results
        });
    });
};

// Display brand create form on GET
exports.brand_create_get = function (req, res) {

    res.render('brand_form', {
        title: 'Add New Brand'
    })
};

// Handle brand create form on POST
exports.brand_create_post = [

    // Validate and sanitize fields
    body('name', 'Name must not be empty.').trim().isLength({
        min: 3
    }).escape(),
    body('about', 'About must contain at least 10 characters').trim().isLength({
        min: 10
    }).escape(),
    body('founders').trim().isLength({
        min: 1
    }).escape().withMessage('Founders name must be specified')
    .matches(/([a-zA-Z\s,]+)/).withMessage('Invalid characters found in founders name. Founders name must be seperated by "," only.'),
    body('headquarters', 'Headquarters location must be specified').trim().isLength({
        min: 1
    }).escape(),
    body('image_url').isURL().withMessage('Please provide a proper image url.'),
    body('website_url').isURL().withMessage('Please provide a proper webiste url.'),

    // Process req after validation and sanitization.
    (req, res, next) => {

        // Extract validation errors from the req
        const errors = validationResult(req);

        // Create a Brand object with escaped and trimmed data.
        const brand = new Brand({
            name: req.body.name,
            about: req.body.about,
            founders: req.body.founders,
            headquarters: req.body.headquarters,
            image_url: req.body.image_url,
            website_url: req.body.website_url
        });

        // check for errors
        if (!errors.isEmpty()) {
            // There are error in submitted data. Render the form again with sanitized values and show error messages.

            res.render('brand_create', {
                title: 'Add New Brand',
                brand: brand,
                errors: errors.array()
            });
            return;
        } else {
            // submitted form data is valid

            // Check if brand already exists in the database
            Brand.findOne({
                    'name': brand.name
                })
                .exec(function (err, old_brand) {
                    if (err) {
                        return next(err);
                    }
                    if (old_brand == null) {
                        // Brand does not exist in the db
                        // Save the brand
                        brand.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                            // Success - redirect to the brand detail page
                            res.redirect(brand.url);
                        })
                        return;

                    }
                    // brand already exists in db
                    // show err message
                    var err = new Error('Same name Brand already exsits in the database.')
                    return next(err);
                })
        }
    }

];

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
    Brand.findById(req.params.id, function (err, brand) {
        if (err) {
            return next(err);
        }
        if (brand == null) { // Brand not found in db
            var error = new Error('Brand not found.');
            error.status = 404;
            return next(error);
        }
        // Success - So, render.
        res.render('brand_form', {
            title: 'Update Brand',
            brand: brand
        });
    });
};

// Handle brand update form on POST
exports.brand_update_post = [
    // Validate and sanitize fields
    body('name', 'Name must not be empty.').trim().isLength({
        min: 3
    }).escape(),
    body('about', 'About must contain at least 10 characters').trim().isLength({
        min: 10
    }).escape(),
    body('founders').trim().isLength({
        min: 1
    }).escape().withMessage('Founders name must be specified')
    .matches(/([a-zA-Z\s,]+)/).withMessage('Invalid characters found in founders name. Founders name must be seperated by "," only.'),
    body('headquarters', 'Headquarters location must be specified').trim().isLength({
        min: 1
    }).escape(),
    body('image_url').isURL().withMessage('Please provide a proper image url.'),
    body('website_url').isURL().withMessage('Please provide a proper webiste url.'),

    // Process req after validation and sanitization.
    (req, res, next) => {

        // Extract validation errors from the req
        const errors = validationResult(req);

        // Create a Brand object with escaped and trimmed data.
        const brand = new Brand({
            name: req.body.name,
            about: req.body.about,
            founders: req.body.founders,
            headquarters: req.body.headquarters,
            image_url: req.body.image_url,
            website_url: req.body.website_url,
            _id: req.params.id
        });

        // check for errors
        if (!errors.isEmpty()) {
            // There are error in submitted data. Render the form again with sanitized values and show error messages.

            res.render('brand_create', {
                title: 'AUpdate Brand',
                brand: brand,
                errors: errors.array()
            });
            return;
        } else {
            // submitted form data is valid

            Brand.findByIdAndUpdate(req.params.id, brand, {}, function (err, updatedBrand) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to updated brand page.
                res.redirect(updatedBrand.url);
            });

        }
    }
];