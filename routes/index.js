var express = require('express');
var router = express.Router();
var Brand = require('../models/Brand');
var Category = require('../models/Category');
var Product = require('../models/Product');

var async = require('async');

/* GET home page. */
router.get('/', function (req, res, next) {

  // async.parallel({
  //   product_count: (callback) => {
  //     Product.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
  //   },
  //   brand_count: (callback) => {
  //     Brand.countDocuments({}, callback);
  //   },
  //   category_count: (callback) => {
  //     Category.countDocuments({}, callback);
  //   }
  // }, (err, results) => {
  //   console.log(results);
  //   res.render('index', {
  //     title: 'Watches Inventory App',
  //     error: err,
  //     data: results
  //   });
  // });
  Brand.find({}, 'name image_url')
    .exec(function (err, all_brands) {
      if (err) {
        return next(err);
      }
      // success, so render
      res.render('index', {
        title: 'Watches Inventory App',
        brand_list: all_brands
      });
    })
});

module.exports = router;