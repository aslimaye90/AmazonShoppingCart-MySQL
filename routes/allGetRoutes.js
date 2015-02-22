var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET categories listing. */
router.get('/categories', function(req, res, next) {
  var queryString = 'SELECT * FROM categories';
  var connection = mysql.createConnection('mysql://root:root@localhost/testAmazonDB');

  connection.connect(function(err){
    if(err)
      console.log('db connection error');
    else{}
  });

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    
    res.json(rows);
  });
  connection.end();
});


/* GET products listing. */
router.get('/products', function(req, res, next) {
  var queryString = 'SELECT * FROM products';
  var connection = mysql.createConnection('mysql://root:root@localhost/testAmazonDB');

  connection.connect(function(err){
    if(err)
      console.log('db connection error');
    else{}
  });

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    
    res.json(rows);
  });
  connection.end();
});


/*detailed info of a product*/
router.get('/products/:Pid',function(req,res){
	var queryString = 
  'select t.P_id as ProductId, t.P_name as ProductName, t.availability as Availability, t.C_name as CategoryName  \
  from  \
  (  \
    select products.P_id, products.name as P_name, products.description as P_desc, products.availability, products.price, categories.C_id, categories.Name as C_name, categories.Description as C_desc  \
    from products  \
    join categories  \
    where products.category=categories.C_id  \
  )as t  \
  where t.P_id=?';
  var id=req.params.Pid;
  var connection = mysql.createConnection('mysql://root:root@localhost/testAmazonDB');

  connection.connect(function(err){
    if(err)
      console.log('db connection error');
    else{}
  });

  connection.query(queryString, [id], function(err, rows, fields) {
    if (err) throw err;
    
    res.json(rows);
  });
  connection.end();
});


/* GET users listing. */
router.get('/users', function(req, res, next) {
  var queryString = 'SELECT * FROM users';
  var connection = mysql.createConnection('mysql://root:root@localhost/testAmazonDB');

  connection.connect(function(err){
    if(err)
      console.log('db connection error');
    else{}
  });

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    
    res.json(rows);
  });
  connection.end();
});


/* GET shopping cart listing. */
router.get('/shoppingcart', function(req, res, next) {
  var queryString = 'SELECT * FROM shoppingcart';
  var connection = mysql.createConnection('mysql://root:root@localhost/testAmazonDB');

  connection.connect(function(err){
    if(err)
      console.log('db connection error');
    else{}
  });

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    
    res.json(rows);
  });
  connection.end();
});


module.exports = router;