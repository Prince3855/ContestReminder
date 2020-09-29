var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

//user model
var usersModel=require('./users.js');
var usersData=usersModel.find({});

// local storage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

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
        
        let loginToken=localStorage.getItem('user');
        try{

            var check=jwt.verify(loginToken,'login',(err,user)=>{
                if(err) return res.render('login',{msg:""});
                // console.log(user);
            });
            
        }
        catch(err){
            return res.render('login',{msg:""});
        }
        next();
    }

}


module.exports = middlewares;