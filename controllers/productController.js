const Product = require('../models/Product');

// index page
exports.index = function(req, res, next){
    res.send('Home page');
}

// Display all of the products
exports.all_products = function(req, res){
    Product.find({}, 'model price image_url')
        .populate('brand')
        .exec(function (err, list_products){
            if(err){
                return next(err);
            }
            // Successful, so render
            res.render('product_list',{title: 'Products', product_list: list_products});
        });
    
};

// Detail page for a specific product
exports.product_detail = function(req, res){
    Product.findOne({'model': req.params.model})
        .populate('brand')
        .populate('category')
        .exec(function (err, product){
            if(err){
                return next(err);
            }
            if(product==null){//No result
                var err = new Error('Product not found!!');
                err.status =404;
                return next(err);
            }
            // Successful. So, render
            res.render('product_detail', {title: 'Product Detail', product: product});
        })
};

// Display product create form on GET
exports.product_create_get = function(req, res){
    res.send('Create new product form GET not implemented yet.');
};

// Handle product create on POST
exports.product_create_post = function(req, res){
    res.send('Create new product POST method is not implemented yet');
};

// Display product delete form on GET
exports.product_delete_get = function(req, res){
    res.send('Delete product GET method is not implemented yet');
};

// Handle product delete on POST
exports.product_delete_post = function(req, res){
    res.send('Delete product POST method is not implemented yet');
};

// Display product update form on GET.
exports.product_update_get = function(req, res){
    res.send('Update product GET method is not implemented yet');
};

// Handle product update on POST
exports.product_update_post = function(req, res){
    res.send('Update product POST method is not implemented yet');
};