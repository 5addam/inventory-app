const express = require('express');
const router = express.Router();

// required controller modules
const product_controller = require('../controllers/productController');

// PRODUCT ROUTES //

// Home Page
router.get('/', product_controller.index);

// GET req for creating a Product.
// *Note: This must come before routes that display Product*
router.get('/create', product_controller.product_create_get);

// GET req to display all products
router.get('/all', product_controller.all_products);

// POST req for creating a Product.
router.post('/create', product_controller.product_create_post);

// GET req to delete a Product
router.get('/:id/delete', product_controller.product_delete_get);

// POST req to delete a Product
router.post('/:id/delete', product_controller.product_delete_post);

// GET req to update a Product
router.get('/:id/update', product_controller.product_update_get);

// POST req to delete a Product
router.post('/:id/update', product_controller.product_update_post);

// GET req for single Product (Details page)
router.get('/:model', product_controller.product_detail);



module.exports = router