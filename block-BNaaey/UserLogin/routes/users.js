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


//handle post request on login
router.post('/login',(req,res,next)=>{
   
  var {email,password}=req.body;
  console.log(email,password);
  if(!email || !password){
    res.redirect('/users/login');
  }

  User.findOne({email},(err,user)=>{
   if(err)return next(err)
   if(!user){
     res.redirect('/users/login');
   }

   //compare the password
   user.verifyPassword(password,(err,result)=>{
    if(err)return next(err);
    if(!result){
      res.redirect('/users/login');
    }else{
      //persist the userlogin using session



     
      req.session.userI=user.id;
       res.render('dashboard',{user});

    }

   })

  })
  
})




module.exports = router;
