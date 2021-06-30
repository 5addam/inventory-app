const express = require('express');
const router = express.Router();

// required controller modules
const category_controller = require('../controllers/categoryController');

// CATEGORY ROUTERS //

router.get('/', category_controller.index);

// GET req for creating a new Category
router.get('/create', category_controller.category_create_get);

// GET req to display list of Categories.
router.get('/all', category_controller.all_categories);

// POST req for creating a new Category.
router.post('/create', category_controller.category_create_post);

// GET req: Delete a Category
router.get('/:id/delete', category_controller.category_delete_get);

// POST req: Delete a Category
router.post('/:id/delete', category_controller.category_delete_post);

// GET req: Update a Category
router.get('/:id/update', category_controller.category_update_get);

// POST req: Update a Category
router.post('/:id/update', category_controller.category_update_post);

// GET req: Detail page
router.get('/:name', category_controller.category_detail);

module.exports = router