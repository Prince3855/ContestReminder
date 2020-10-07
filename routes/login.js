var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var session = require('express-session');
var router = express.Router();

var verify = require('./middleware.js');  //middleware

var usersModel=require('./users.js');    // user model
var usersData=usersModel.find({});

/* GET login page. */
router.get('/',function(req, res, next) {
  let loginToken=req.session.loginuser;
  if(loginToken){
    console.log(loginToken);
    res.redirect('../');
  }
  else res.render('login',{msg:""});
});


/* user login request */
router.post('/',(req,res,next)=>{

  let email=req.body.email;
  let password=req.body.password;

  let user=usersModel.findOne({email:email});
  
  user.exec((err,data)=>{
      if(err) throw err;
      else if(data){

          // password match
          let passwordMatch=bcrypt.compareSync(req.body.password, data.password);
          if(passwordMatch) {
            req.session.loginuser=data.userName;
            res.redirect('/');
          }
          else res.render('login',{msg:"*Wrong Password"});

      }
      else res.render('login',{msg:"*User not found"});
  })

})

module.exports = router;
