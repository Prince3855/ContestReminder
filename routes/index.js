var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs'); 
var path = require('path');
var jwt = require('jsonwebtoken');

var router = express.Router();

//access middlewares
var verify = require('./middleware.js');

// access contest model
var contestModel=require('./contest.js');
var contestData=contestModel.find({});


/* GET home page. */
router.get('/',verify.loginCheck, function (req, res, next) {

  let userName="";
  let loginToken=localStorage.getItem('user');
  var check=jwt.verify(loginToken,'login',(err,user)=>{
    if(err) return res.redirect("login");
    userName=user.userName;
    // console.log(user);
  });

  contestData.exec((err, contestDetails) => {
    if (err) throw err;
    // console.log(contestDetails.length);
    res.render('index', {  data: contestDetails ,user:userName});
  });
  
});


//logout 
router.post('/',(req,res,next)=>{
  localStorage.removeItem('user');
  res.redirect('login');
})



module.exports = router;
