const Product = require('../models/Category');

// index page
exports.index = function(req, res, next){
    res.redirect('/');
}

// Display all Categories.
exports.all_categories = function(req, res){
    res.send('NOT IMPLEMENTED: GET list of all the categories.');
};

// Detail page for a specific Categories.
exports.category_detail = function(req, res){
    res.send('NOT IMPLEMTNED: GET detail page of a Category.');
};

// Display Category create form on GET
exports.category_create_get = function(req, res){
    res.send('NOT IMPLEMENTED: GET Category create form.');
};

// Handle Cateogry create form on POST
exports.category_create_post = function(req, res){
    res.send('NOT IMPLEMENTED: POST Category create form.');
};

// Display Category delete form on GET
exports.category_delete_get = function(req, res){
    res.send('NOT IMPLEMENTED: GET Category delete form.');
};

// Handle Category delete form on POST
exports.category_delete_post = function(req, res){
    res.send('NOT IMPLEMENTED: POST Category delete form.');
};

// Display Category update form on GET
exports.category_update_get = function(req, res){
    res.send('NOT IMPLEMENTED: GET Category update form.');
};

// Handle Category update form on POST
exports.category_update_post = function(req, res){
    res.send('NOT IMPLEMENTED: POST Category update form.');
};
