#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Product = require('./models/Product')
var Brand = require('./models/Brand')
var Category = require('./models/Category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = []
var categories = []
var products = []

function brandCreate(name, about, founders, headquarters, image_url, website_url, cb) {
  branddetail = {
    name: name,
    about: about,
    founders: founders,
    headquarters: headquarters,
    image_url: image_url,
    website_url: website_url
  }
  // if (d_birth != false) authordetail.date_of_birth = d_birth
  // if (d_death != false) authordetail.date_of_death = d_death

  var brand = new Brand(branddetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand)
  });
}

function categoryCreate(name, image_url, cb) {
  var category = new Category({
    name: name,
    image_url: image_url
  });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  });
}

function productCreate(title, model, summary, brand, item_shape, category, display_type, band_color, dial_color, price, stock, image_url, cb) {
  productdetail = {
    title: title,
    model: model,
    summary: summary,
    brand: brand,
    item_shape: item_shape,
    display_type: display_type,
    band_color: band_color,
    dial_color: dial_color,
    price: price,
    stock: stock,
    image_url: image_url

  }
  if (category != false) productdetail.category = category

  var product = new Product(productdetail);
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New product: ' + product);
    products.push(product)
    cb(null, product)
  });
}


// function bookInstanceCreate(book, imprint, due_back, status, cb) {
//   bookinstancedetail = {
//     book: book,
//     imprint: imprint
//   }
//   if (due_back != false) bookinstancedetail.due_back = due_back
//   if (status != false) bookinstancedetail.status = status

//   var bookinstance = new BookInstance(bookinstancedetail);
//   bookinstance.save(function (err) {
//     if (err) {
//       console.log('ERROR CREATING BookInstance: ' + bookinstance);
//       cb(err, null)
//       return
//     }
//     console.log('New BookInstance: ' + bookinstance);
//     bookinstances.push(bookinstance)
//     cb(null, book)
//   });
// }


function createCategoryBrands(cb) {
  async.series([
      function (callback) {
        brandCreate(
          'Seiko',
          'Seiko Holdings Corporation, commonly known as Seiko, is a Japanese maker of watches, clocks, electronic devices, semiconductors, jewelries, and optical products.',
          'Kintarō Hattori',
          'Minato City, Tokyo, Japan',
          'https://storage.seikowatches.com/image/2018/02/23102020717440/1600/1_history_01.jpg',
          'https://www.seikowatches.com/global-en',
          callback
        );
      },
      function (callback) {
        brandCreate('Rolex',
          'Rolex SA is a luxury watch manufacturer based in Geneva, Switzerland. Originally founded as Wilsdorf and Davis by Hans Wilsdorf and Alfred Davis in London, England in 1905, the company registered Rolex as the brand name of its watches in 1908, and became Rolex Watch Co. Ltd. in 1915.',
          'Hans Wilsdorf, Alfred Davis',
          'Geneva, Switzerland',
          'https://content.rolex.com/dam/new-watches-2020/new-datejust/new-datejust-beauty-watch.jpg',
          'https://www.rolex.com',
          callback);
      },
      function (callback) {
        brandCreate('TAG Heuer',
          'TAG Heuer S.A. is a Swiss luxury watchmaker that designs, manufactures and markets watches and fashion accessories, as well as eyewear and mobile phones manufactured under license by other companies and carrying the TAG Heuer brand name.',
          'Edouard Heuer',
          'La Chaux-de-Fonds, Switzerland',
          'https://www.tagheuer.com/on/demandware.static/-/Library-Sites-TagHeuer-Shared/default/dw0d404d7c/images/PLP/carrera/TH_Top_Banner_Carrera-chrono.jpg',
          'https://www.tagheuer.com',
          callback);
      },
      function (callback) {
        brandCreate('Hublot',
          "Hublot is a Swiss luxury watchmaker founded in 1980 by Italian Carlo Crocco. The company operates as a wholly owned subsidiary of France's LVMH. In 1980, it also marked the birth of the 'Fusion' concept a few months after being founded.",
          'Carlo Crocco',
          'Nyon, Switzerland',
          'https://www.hublot.com/sites/default/files/styles/global_laptop_1x/public/2021-04/big-bang-sang-bleu-ii-all-3-LF.jpg',
          'https://www.hublot.com',
          callback);
      },
      function (callback) {
        brandCreate('Casio',
          'Casio Computer Co., Ltd. is a Japanese multinational electronics manufacturing company headquartered in Shibuya, Tokyo, Japan. Its products include calculators, mobile phones, digital cameras, electronic musical instruments, and analogue and digital watches.',
          'Tadao Kashio, Toshio Kashio',
          'Shibuya City, Tokyo, Japan',
          'https://www.casio-intl.com/cs/Satellite?blobcol=urldata&blobheader=image%2Fjpeg&blobheadername1=content-disposition&blobheadervalue1=inline%3Bfilename%3DEFR-569BL+1200x600.jpg&blobkey=id&blobtable=MungoBlobs&blobwhere=1426296869086&ssbinary=true',
          'https://www.casio.com/',
          callback);
      },
      function (callback) {
        categoryCreate("Men's Watch",
          'https://embed.widencdn.net/img/citizenwatch/jb1u0aa8dj/exact/mens-new-arrivals-banner-F18-hero.jpeg',
          callback);
      },
      function (callback) {
        categoryCreate("Women's Watch",
          'https://embed.widencdn.net/img/citizenwatch/dgyew8s776/exact/ladies-style-banner-modern-hero.jpeg',
          callback);
      },
      function (callback) {
        categoryCreate("Sports Watch",
          'https://cdn.shopify.com/s/files/1/1902/9663/files/Men_s_Sport_Collection_Banner_-_Nov_18_1024x1024.jpg',
          callback);
      },
      function (callback) {
        categoryCreate("Analog Watch",
          'https://www.watchshopping.com/media/tm_blog/p/o/1/2147/post_1_2147.jpg',
          callback);
      },
      function (callback) {
        categoryCreate("Digital Watch",
          'https://cdn.everydaycarry.com/uploads/21-04-03/16068b424485c4.jpg',
          callback);
      },
      function (callback) {
        categoryCreate("Automatic Watch",
          'https://theslenderwrist.com/wp-content/uploads/best-automatic-watches-under-200.jpg',
          callback);
      },
      function (callback) {
        categoryCreate("Chronograph Watch",
          'https://www.iwc.com/content/dam/specials/chronograph-watches/banner_teaser.jpg',
          callback);
      },
      function (callback) {
        categoryCreate("Quartz Watch",
          'https://cdn.mos.cms.futurecdn.net/EZYmCZcfbX4nnTcQSdpka3.jpg',
          callback);
      },
    ],
    // optional callback
    cb);
}


function createProducts(cb) {
  async.parallel([
      function (callback) {
        productCreate('Seiko SRPG27K1 Automatic Wrist Watch',
          'SRPG27K1',
          'SEIKO SNKE63J1 Automatic Wrist Watch',
          brands[0],
          'Round',
          [categories[0], categories[5]],
          'Analog',
          'Silver',
          'Black',
          '20,900',
          2,
          'https://storage.seikowatches.com/image/2021/04/28201000194508/0/SRPG27K1.png',
          callback);
      },
      function (callback) {
        productCreate(
          'Seiko Presage SPB215J1 Wrist Watch',
          'SPB215J1',
          'Presage SPB215J1 Wrist Watch. Limited edition of 1.200 pieces',
          brands[0],
          'Round',
          [categories[0], categories[5]],
          'Analog',
          'Brown',
          'Cream White',
          '1,50,000',
          1,
          'https://storage.seikowatches.com/image/2021/05/07220601961074/0/SPB215J1.png',
          callback
        );
      },
      function (callback) {
        productCreate(
          'TAG Heuer Monaco Titan',
          'CAW218B.FC6496',
          'This TAG Heuer Monaco Grey Titanium is a chronograph limited to 500 pieces, a sporty, understated and lightweight model. (Special Edition)',
          brands[2],
          'Square',
          [categories[0], categories[6]],
          'Analog',
          'Black',
          'Gray',
          '14,33,277',
          1,
          'https://www.tagheuer.com/on/demandware.static/-/Sites-tagheuer-master/default/dwf39c0040/TAG_Heuer_Monaco/CAW218B.FC6496/CAW218B.FC6496_1000.png',
          callback
        );
      },
      function (callback) {
        productCreate(
          'G-Shock Electro-luminescent Watch',
          'DW5600SKE-7',
          'The digital standard square DW5600SKE-7 of the new TRANSPARENT PACK Series timepieces are created using semi-transparent resin parts. Everything about this white-based model makes it the perfect choice as an attractive fashion item.',
          brands[4],
          'Square',
          [categories[0], categories[2], categories[4]],
          'Digital',
          'Transparent',
          'Gray/Black',
          '17,319',
          4,
          'https://www.tagheuer.com/on/demandware.static/-/Sites-tagheuer-master/default/dwf39c0040/TAG_Heuer_Monaco/CAW218B.FC6496/CAW218B.FC6496_1000.png',
          callback
        );
      },
      function (callback) {
        productCreate(
          'Oyster Perpetual Lady-Datejust',
          'm279160-0013',
          'This Oyster Perpetual Lady-Datejust in Oystersteel features a pink dial and a Jubilee bracelet.',
          brands[1],
          'Round',
          [categories[1], categories[3]],
          'Analog',
          'Silver',
          'Pink',
          '1,02,000',
          3,
          'https://content.rolex.com/dam/2021/upright-bba-with-shadow/m124200-0004.png',
          callback
        );
      },

    ],
    // optional callback
    cb);
}


// function createBookInstances(cb) {
//   async.parallel([
//       function (callback) {
//         bookInstanceCreate(books[0], 'London Gollancz, 2014.', false, 'Available', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[1], ' Gollancz, 2011.', false, 'Loaned', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[2], ' Gollancz, 2015.', false, false, callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Available', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Maintenance', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Loaned', callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[0], 'Imprint XXX2', false, false, callback)
//       },
//       function (callback) {
//         bookInstanceCreate(books[1], 'Imprint XXX3', false, false, callback)
//       }
//     ],
//     // Optional callback
//     cb);
// }



async.series([
    createCategoryBrands,
    createProducts
  ],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Products: ' + products);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });