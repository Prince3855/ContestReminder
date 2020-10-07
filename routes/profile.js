var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

var router = express.Router();

//access middlewares
var verify = require('./middleware.js');

//user model
var usersModel = require('./users.js');
var usersData = usersModel.find({});

// access contest model
var contestModel = require('./contest.js');
var contestData = contestModel.find({});

/* GET home page. */
router.get('/', verify.loginCheck, function (req, res, next) {

    let cuurentUser = "";
    let platform;

    let loginToken = req.session.loginuser;
    if(loginToken){
        cuurentUser = loginToken;
    }
    else{
        return res.redirect("login");
    }
   

    let user = usersModel.findOne({ userName: cuurentUser});
    user.exec((err, detail) => {
        if (err) throw err;
        platform = detail.contest;
        // console.log(platform);
        res.render('profile', { user: detail.userName, email: detail.email, data: platform });
    })


});

router.post('/', function (req, res, next) {
    
    var platform = new Object();
    platform['codechef'] = false;
    platform['codeforces'] = false;
    platform['spoj'] = false;
    platform['hackerearth'] = false;
    platform['hackerrank'] = false;

    let array=new Array();
    array=array.concat(req.body.contest);
    array.forEach(ele => {
        platform[ele] = true;
    });
    // console.log(platform);


    let loginToken = req.session.loginuser;
    if(loginToken){
        let data = usersModel.findOne({ userName: loginToken});
        data.exec((err,user)=>{
            if(err) return res.redirect("login");
            usersModel.updateOne({ _id: user.id }, { contest: platform }, (erro, data) => {
                if (erro) throw erro;
                res.redirect('profile');
            })
        })
    }
    else{
        return res.redirect("login");
    }

});


module.exports = router;
