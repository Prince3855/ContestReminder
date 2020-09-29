var express = require('express');
var bcrypt = require('bcrypt');
var verify = require('./middleware.js');
var router = express.Router();
var jwt = require('jsonwebtoken');

//user model
var userModel=require('./users.js');
var usersData=userModel.find({});

// local storage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

/* GET Register page. */
router.get('/',function(req, res, next) {
  let loginToken=localStorage.getItem('user');
        try{

            var check=jwt.verify(loginToken,'login',(err,user)=>{
                if(err) res.render('register',{msg:""});
                // console.log(user);
            });
            
        }
        catch(err){
            return res.render('register',{msg:""});
        }
        res.redirect('../');
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
