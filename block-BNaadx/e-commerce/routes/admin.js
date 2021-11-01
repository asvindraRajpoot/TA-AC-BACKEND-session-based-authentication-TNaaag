var express = require('express');
var router = express.Router();
var flash=require('connect-flash');


var Admin =require('../models/admin');
/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render('adminIndex');
 // next();
});



//render login form
router.get('/adminLogin',(req,res,next)=>{
  var error=req.flash('error')[0];
  res.render('adminLogIn',{error});
 // next()
})


//render register form
router.get('/adminRegister',(req,res,next)=>{
  var error=req.flash('error')[0];
  res.render('adminRegister',{error});
  //next();
})


//capture the from registration form
router.post('/adminRegister',(req,res,next)=>{
  console.log(req.body);
  Admin.create(req.body,((err,admin)=>{
    if(err){
      if(err.code==='MongoError'){
        req.flash('error','This email is taken');
        return res.redirect('/admin/adminRegister');
      }

      if(err.name==='ValidationError'){
        req.flash('error',err.message);
        return res.redirect('/admin/adminRegister');
      }
      return res.json({err});
    }
    //console.log('after saving into database',admin;
   // req.flash('error','adminhasbeen Successfully registered');
    res.redirect('/admin/adminLogIn');
  }))
  
})


//handle post request on login
router.post('/adminLogin',(req,res,next)=>{
   
  var {email,password}=req.body;
  //console.log(email,password);
  if(!email || !password){
    req.flash('error','Email/Password is required');
      return res.redirect('/admin/adminLogin');
   
  }

  Admin.findOne({email},((err,admin)=>{
   if(err)return next(err)
   if(!admin){
     req.flash('error','admin does not exist');
     return res.redirect('/admin/adminLogin');
   }

   //compare the password
   Admin.verifyPassword(password,(err,result)=>{
    if(err)return next(err);
    if(!result){
      req.flash('error','Password is not correct');
      return res.redirect('/admin/adminLogin');
    }else{
      //persist the adminogin using session



     
       req.session.admin=adminid;
       req.flash('error','Login Successful');
       res.redirect('/admin/dashboard');

    }

   })
  }))
})

router.get('/adminDashboard',(req,res)=>{
  let error=req.flash('error')[0];
  res.render('adminDashboard',{error});
})

//handle logout
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/admin/adminLogin');

})



//create product
router.get('/product/new',(req,res)=>{
    res.render('createProduct');
})



//update product








//handle products list
router.get('/adminProductList',(req,res)=>{
    res.render('adminProductList');
})






module.exports = router;
