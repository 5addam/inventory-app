const express = require('express');
const router = express.Router();

// required controller modules
const brand_controller = require('../controllers/brandController');

// BRAND ROUTERS //

//  router.get('/')

// GET req for creating a new Brand
router.get('/create', brand_controller.brand_create_get);

// GET req to display list of Brands.
router.get('/all', brand_controller.all_brands);

// POST req for creating a new Brand.
router.post('/create', brand_controller.brand_create_post);

// GET req: Delete a Brand
router.get('/:id/delete', brand_controller.brand_delete_get);

// POST req: Delete a Brand
router.get('/:id/delete', brand_controller.brand_delete_post);

// GET req: Update a Brand
router.get('/:id/update', brand_controller.brand_update_get);

// POST req: Update a Brand
router.post('/:id/update', brand_controller.brand_update_post);

// GET req: Detail page
router.get('/:id', brand_controller.brand_detail);

module.exports = router