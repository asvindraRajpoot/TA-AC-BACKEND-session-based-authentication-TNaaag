var express = require('express');
var router = express.Router();
var flash=require('connect-flash');


var User =require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('userIndex');
 // next();
});



//render login form
router.get('/userLogin',(req,res,next)=>{
  var error=req.flash('error')[0];
  res.render('userLogin',{error});
 // next()
})


//render register form
router.get('/userRegister',(req,res,next)=>{
  var error=req.flash('error')[0];
  res.render('userRegister',{error});
  //next();
})


//capture the from registration form
router.post('/userRegister',(req,res,next)=>{
  console.log(req.body);
  User.create(req.body,(err,user)=>{
    if(err){
      if(err.code==='MongoError'){
        req.flash('error','This email is taken');
        return res.redirect('/users/registers');
      }

      if(err.name==='ValidationError'){
        req.flash('error',err.message);
        return res.redirect('/users/userRegister');
      }
      return res.json({err});
    }
    //console.log('after saving into database',user);
   // req.flash('error','User hasbeen Successfully registered');
    res.redirect('/users/userLogin');
  })
  
})


//handle post request on userLogin
router.post('/userLogin',(req,res,next)=>{
   
  var {email,password}=req.body;
  //console.log(email,password);
  if(!email || !password){
    req.flash('error','Email/Password is required');
      return res.redirect('/users/userLogin');
   
  }

  User.findOne({email},(err,user)=>{
   if(err)return next(err)
   if(!user){
     req.flash('error','user does not exist');
     return res.redirect('/users/userLogin');
   }

   //compare the password
   user.verifyPassword(password,(err,result)=>{
    if(err)return next(err);
    if(!result){
      req.flash('error','Password is not correct');
      return res.redirect('/users/userLogin');
    }else{
      //persist the useruserLogin using session



     
       req.session.userI=user.id;
       req.flash('error','userLogin Successful');
       res.redirect('/users/dashboard');

    }

   })

  })
  
})

router.get('/dashboard',(req,res)=>{
  let error=req.flash('error')[0];
  res.render('dashboard',{error});
})

//handle logout
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/userLogin');

})



///handle user product list

router.get('/userProductList',(req,res)=>{
  res.render('userProductList');
})



module.exports = router;
