var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs'); 
var path = require('path');
var session = require('express-session');

var router = express.Router();

//access middlewares
var verify = require('./middleware.js');

// access contest model
var contestModel=require('./contest.js');
var contestData=contestModel.find({});


/* GET home page. */
router.get('/',verify.loginCheck, function (req, res, next) {

  let userName="";
  let loginToken=req.session.loginuser;
  userName=loginToken;

  contestData.exec((err, contestDetails) => {
    if (err) throw err;
    else{
      // console.log(contestDetails);
      res.render('index', {  data: contestDetails ,user:userName});
    }
    
  });
  
});


//logout 
router.post('/',(req,res,next)=>{
  req.session.destroy((err)=>{
    if(err) res.redirect('/');
  });
  res.redirect('login');
})



module.exports = router;
