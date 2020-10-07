var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var session = require('express-session');

//user model
var usersModel=require('./users.js');
var usersData=usersModel.find({});


middlewares={


    /* use during register to check Duplicate entry */
    checkDuplicate:(req,res,next)=>{
        let uname=req.body.userName;
        let Email=req.body.email;

        let userExist=usersModel.findOne({$or:[{userName:uname},{email:Email}]});

        userExist.exec((err,data)=>{
            if(err) throw err;
            if(data) {
                return res.render('register',{msg : "*user already exist"});
            }
            next();
        })
    },


    /* Login Check */
    loginCheck:(req,res,next)=>{
        
        let loginToken=req.session.loginuser;
        if(loginToken){
        }
        else{
            return res.redirect('login');
        }
        next();
    }

}


module.exports = middlewares;