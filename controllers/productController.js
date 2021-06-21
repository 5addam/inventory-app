// index page
exports.index = function(req, res, next){
    res.send('Home page');
}

// Display all of the products
exports.all_products = function(req, res){
    res.send('All Products list not implemented yet.');
};

// Detail page for a specific product
exports.product_detail = function(req, res){
    res.send('Detail page of the product is not implemented yet.');
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