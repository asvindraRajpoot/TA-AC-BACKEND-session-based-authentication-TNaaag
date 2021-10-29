var express = require('express');
var router = express.Router();


var User =require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Welcome');
 // next();
});


//render login form
router.get('/login',(req,res,next)=>{
  res.render('logIn');
 // next()
})


//render register form
router.get('/register',(req,res,next)=>{
  res.render('register');
  //next();
})


//capture the from registration form
router.post('/register',(req,res,next)=>{
  console.log(req.body);
  User.create(req.body,(err,user)=>{
    if(err)return next(err);
    //console.log('after saving into database',user);
    res.render('logIn');
  })
  
})




module.exports = router;
