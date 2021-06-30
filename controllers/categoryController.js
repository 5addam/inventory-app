const Category = require('../models/Category');
const Product = require('../models/Product');

const async = require('async');
const {
    body,
    validationResult
} = require('express-validator');

// index page
exports.index = function (req, res, next) {
    res.redirect('/');
}

// Display all Categories.
exports.all_categories = function (req, res) {
    Category.find()
        .sort([
            ['name', 'ascending']
        ])
        .exec(function (err, list_categories) {
            if (err) {
                return next(err);
            }
            // Successful - so, render.
            res.render('categories_list', {
                title: 'List of Categories',
                categories_list: list_categories
            });
        });
};

// Detail page for a specific Categories.
exports.category_detail = function (req, res, next) {
    var my_cagtegory;
    async.waterfall([
        function (callback) {
            Category.findOne({
                'name': req.params.name
            }).exec(callback)
        },
        function (category, callback) {
            if (category == null) {
                const err = new Error('Category not found.');
                err.status = 404;
                return next(err);
            }
            my_cagtegory = category;
            Product.find({
                    'category': category._id
                }, 'model price image_url')
                .populate('brand')
                .exec(callback)
        },
    ], function (err, products) {
        if (err) {
            return next(err);
        }

        // Successful. So, render
        res.render('category_detail', {
            title: 'Category Detail',
            category: my_cagtegory,
            products: products
        });
    });

};

// Display Category create form on GET
exports.category_create_get = function (req, res) {
    res.render('category_form', {
        title: 'Add New Category'
    });
};

// Handle Cateogry create form on POST
exports.category_create_post = [
    // validate and sanitize the data fields
    body('name', 'Name must be specified. (must be 3 characters long)').trim().isLength({
        min: 3
    }),
    body('image_url').isURL().withMessage('Please provide a valid url'),

    // Process req after data validation and sanitization
    (req, res, next) => {

        // Extract validation errors from req
        const errors = validationResult(req);

        // Create new category object with escaped and trimmed data
        const category = new Category({
            name: req.body.name,
            image_url: req.body.image_url
        });

        // Check for errors
        if (!errors.isEmpty()) {
            // There are errors in submitted form. Render form again
            res.render('category_form', {
                title: 'Add New Category',
                category: category,
                errors: errors.array()
            });
        } else {
            // submitted form data is valid 

            // check if category already exists in db
            Category.findOne({
                    'name': category.name
                })
                .exec(function (err, old_category) {
                    if (err) {
                        return next(err);
                    }

                    if (old_category == null) {
                        // category not found in db
                        // save
                        category.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                            // Success - go to detail page
                            res.redirect(category.url)
                        });
                        return;
                    }

                    // category already exists in db
                    // show err message
                    var err = new Error('Same name Category already exsits in the database.')
                    return next(err);
                });
        }

    }
];

// Display Category delete form on GET
exports.category_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: GET Category delete form.');
};

// Handle Category delete form on POST
exports.category_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: POST Category delete form.');
};

// Display Category update form on GET
exports.category_update_get = function (req, res) {
    Category.findById(req.params.id)
        .exec(function (err, category) {
            if (err) {
                return next(err);
            }
            if (category == null) { // Category not found in db
                var error = new Error('Category not found.');
                error.status = 404;
                return next(error);
            }
            // Success - So, render.
            res.render('category_form', {
                title: 'Update Category',
                category: category
            });
        })
};

// Handle Category update form on POST
exports.category_update_post = [

    // validate and sanitize the data fields
    body('name', 'Name must be specified. (must be 3 characters long)').trim().isLength({
        min: 3
    }),
    body('image_url').isURL().withMessage('Please provide a valid url'),

    // Process req after data validation and sanitization
    (req, res, next) => {

        // Extract validation errors from req
        const errors = validationResult(req);

        // Create new category object with escaped and trimmed data
        const category = new Category({
            name: req.body.name,
            image_url: req.body.image_url,
            _id: req.params.id
        });

        // Check for errors
        if (!errors.isEmpty()) {
            // There are errors in submitted form. Render form again
            res.render('category_form', {
                title: 'Update Category',
                category: category,
                errors: errors.array()
            });
            return;
        } else {
            // submitted form data is valid 

            // update
            Category.findByIdAndUpdate(req.params.id, category, {
                new: true
            }, function (err, updatedCategory) {
                if (err) {
                    return next(err);
                }
                // Success - go to detail page
                res.redirect(updatedCategory.url)
            });
        }
    }

];