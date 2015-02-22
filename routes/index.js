var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var pool = require('./connectionPool/thePool');

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.name){
    res.render('pages/index', 
    	{ 
    		title: 'Home',
    		name: req.session.name,
    		page: 'Your Home page'
    });
  }
  else
    res.redirect('/login');
});

/* GET categories page. */
router.get('/categories', function(req, res) {
  if(req.session.name){
	  var queryString = 'SELECT * FROM categories';
  	pool.getConnection(function(err,connection){
      if (err) 
        throw err;

      connection.query(queryString, function(err, rows, fields){
        if (err) 
          throw err;
        
        rows=JSON.parse(JSON.stringify(rows));
        res.render('pages/categories',
        { 
          title: 'Categories', 
          data : JSON.parse(JSON.stringify(rows))
        });
      });

      connection.release();
    });
  }
  else
    res.redirect('/login');
});


/* GET products page. */
router.get('/products', function(req, res) {
  if(req.session.name){
  	var queryString = 
  	'select products.P_id as Pid, products.name as name, products.price as price, categories.Name as category  \
     from products  \
  	 join categories  \
  	 where products.category=categories.C_id';
    pool.getConnection(function(err,connection){
      if (err) 
        throw err;

      connection.query(queryString, function(err, rows, fields){
        if (err) 
          throw err;
        
        rows=JSON.parse(JSON.stringify(rows));
        res.render('pages/products',
        { 
          title: 'Products', 
          data : JSON.parse(JSON.stringify(rows))
        });
      });

      connection.release();
    });
  }
  else
    res.redirect('/login');
});


/* GET login page. */
router.get('/login', function(req, res) {
  res.render('pages/login', 
    {
      title: 'Login'
    });
});

/*check login credentials and act accordingly*/
router.post('/login', function(req, res) {
  var queryString = 'SELECT * FROM users WHERE userId = ?';
  pool.getConnection(function(err,connection){
    if (err) 
      throw err;

    connection.query(queryString, [req.body.userId], function(err, rows, fields){
      if (err) 
        throw err;
      
      rows=JSON.parse(JSON.stringify(rows));
      if(rows.length==0){
        console.log('userId incorrect');
        res.render('pages/login', {title: 'Login'});
      }
      else if(rows[0].password==req.body.inputPassword){
        console.log('login successful!');
        req.session.name=rows[0].name;
        res.redirect('/');
      }
      else{
        console.log('userId/pass combination incorrect');
        res.redirect('/login');
      }
    });

    connection.release();
  });
});

/*LOGOUT and render login page.*/
router.get('/logout', function(req, res, next){
  req.session.destroy(function(err){
    if(err) 
      console.log(err);
    else{
      res.redirect('/login');
    }
  });
});

module.exports = router;
