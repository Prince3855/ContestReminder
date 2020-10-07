var express = require('express');
var bcrypt = require('bcrypt');
var verify = require('./middleware.js');
var router = express.Router();
var session = require('express-session');

//user model
var userModel=require('./users.js');
var usersData=userModel.find({});


/* GET Register page. */
router.get('/',function(req, res, next) {
  let loginToken=req.session.loginuser;
  if(loginToken){
    res.redirect('../');
  }
  else{
    res.render('register',{msg:""});
  }
        
});


/* Post registered data */
router.post('/',verify.checkDuplicate,(req,res,next)=>{
  
  //create new user
  user=new userModel({
    userName:req.body.userName,
    email:req.body.email,
    password:req.body.password
  });
  let confirmPassword=req.body.comfirmPassword;


  if(user.password.length<=6){
    res.render('register',{msg : "*password length must be greterthan 6"});
  }
  else if(confirmPassword != user.password){
    res.render('register',{msg : "*password not match"});
  }
  else{
    user.password=bcrypt.hashSync(req.body.password, 10);
    user.save((err,res1)=>{
      if(err) throw err;
      res.render('login', { msg :""});
    });
  }

});

module.exports = router;
