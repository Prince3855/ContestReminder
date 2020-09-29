var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();

var verify = require('./middleware.js');  //middleware

var usersModel=require('./users.js');    // user model
var usersData=usersModel.find({});

//local storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* GET login page. */
router.get('/',verify.loginCheck,function(req, res, next) {
  res.redirect('../');
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
            let loginToken = jwt.sign({id:data._id,userName:data.userName,email:user.email},'login');
            localStorage.setItem('user',loginToken);
            res.redirect('/');
          }
          else res.render('login',{msg:"*Wrong Password"});

      }
      else res.render('login',{msg:"*User not found"});
  })

})

module.exports = router;
