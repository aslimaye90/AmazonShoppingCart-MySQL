var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = require('./connectionPool/thePool');

/* GET shopping cart page. */
router.get('/', function(req, res, next) {
  if(req.session.name){
    var queryString = 
    'SELECT products.P_id as Pid, products.name as name, products.price as price, shoppingcart.quantity as quantity  \
    FROM products  \
    JOIN shoppingcart  \
    WHERE products.P_id=shoppingcart.productId';

    pool.getConnection(function(err,connection){
      if (err)
        throw err;
      connection.query(queryString, function(err, rows, fields) {
        if (err)
          throw err;
      
        res.render('pages/shoppingcart',
          { 
            title: 'Shopping Cart', 
            data : JSON.parse(JSON.stringify(rows))
          });
      });
      connection.release();
    });
  }
  else
    res.redirect('/login');
});

/* ADD item to shopping cart. */
router.post('/', function(req, res, next) {
  var itemCheckQuery = 'SELECT * FROM shoppingcart WHERE productId = ?';
  var insertQuery = 'INSERT INTO shoppingcart SET ?';
  
  pool.getConnection(function(err,connection){
    if (err)
      throw err;

    connection.query(itemCheckQuery, [req.body.id], function(err,rows,fields){
      if (err)
        throw err;
      else if(rows.length==0){
        var data = {
          productId: req.body.id,
          quantity: 1
        }
        connection.query(insertQuery, data, function(err, status){
          if (err)
            throw err;
        })
      }
      else
        console.log('item already exists');
    });

    connection.release();
  });

  res.redirect('/products');
});


/* DELETE shopping cart item. */
router.post('/delete', function(req, res, next) {
  var query = 'DELETE FROM shoppingcart WHERE productId = ?';
  
  pool.getConnection(function(err,connection){
    if (err)
      throw err;

    connection.query(query, [req.body.id], function(err,rows,fields){
      if (err)
        throw err;
    });

    connection.release();
  });

  res.redirect('/shoppingcart');
});



/* INCREMENT item count in shopping cart. */
router.post('/inc', function(req, res, next) {
  var query = 'UPDATE shoppingcart SET ? WHERE productId = ?';
  var data = {
    productId: req.body.id,
    quantity: parseInt(req.body.quantity)+1
  }

  pool.getConnection(function(err,connection){
    if (err)
      throw err;

    connection.query(query, [data,req.body.id], function(err,status){
      if (err)
        throw err;
    });

    connection.release();
  });

  res.redirect('/shoppingcart');
});



/* DECREMENT item count in shopping cart. */
router.post('/dec', function(req, res, next) {
  var query = 'UPDATE shoppingcart SET ? WHERE productId = ?';
  var data = {
    productId: req.body.id,
    quantity: parseInt(req.body.quantity)-1
  }

  pool.getConnection(function(err,connection){
    if (err)
      throw err;

    connection.query(query, [data,req.body.id], function(err,status){
      if (err)
        throw err;
    });

    connection.release();
  });

  res.redirect('/shoppingcart');
});


module.exports = router;