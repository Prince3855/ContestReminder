var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var https = require('https');
var nodemailer = require("nodemailer");
var router = express.Router();

// access contest model
var contestModel = require('./contest.js');
var contestData = contestModel.find({});

//access user model
var usersModel = require('./users.js');
var usersData = usersModel.find({});

//api url
const apiUrl = new URL('https://www.stopstalk.com/contests.json');

//global variable
let contestDetails;
let userDetails;
let reminderedContest=new Map();




exports.getcontestdata=getContestData = () => {

    //make request to get contest data
    https.get(apiUrl, (res) => {
        let data = "";
        res.on('data', part => {
            data += part;
        });

        res.on('end', () => {
            data = JSON.parse(data);
            data = data['upcoming'];

            if (data.length > 0) {

                //delete previouse data from database
                contestModel.deleteMany({}, function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log("deleted");

                        //save contest data in to database
                        contestModel.collection.insertMany(data, function (err, docs) {
                            if (err) {
                                return console.error(err);
                            } else {
                                console.log("Multiple documents inserted to Collection");
                                contestDetails = data;
                            }
                        });
                    }
                });
            }
        });

    });

    //clear map of alredy sended reminder contest
    reminderedContest.clear();

}
// setInterval(getContestData, 24*60*60*1000); //repeate after interval of 12 hours and get contest Details






//find apropriare contests and acording to contests platform find apropriate user
//and send data to the sendReminder function to send contest reminder
exports.sendMessege=function findUser() {

    //get contest details from database
    contestData.exec(function (err, contests) {
        if (err) throw err;
        contestDetails = contests;

        //find contest for which we will send reminder
        contestDetails.forEach(function loop(contest) {
            contestdate = new Date(contest.StartTime);
            today = new Date();
            // console.log((contestdate-today)/(60*60*1000));
            let hours = (contestdate - today) / (60 * 60 * 1000);
           
            if ( hours>=0 && hours <= 35 && reminderedContest[contest._id]==undefined ) {
                // console.log(contest.Platform);
                
                //Find user who wants reminder of given contest 
                if (contest.Platform == 'CODEFORCES') {
                    usersModel.find({ 'contest.codeforces': true }, (err, user) => {
                        logoUrl='https://raw.githubusercontent.com/codestromer/ContestReminder/master/Reminder-Mail/codeforces.png';
                        sendReminder(user, contest,logoUrl);
                    });
                }
                else if (contest.Platform == 'HACKEREARTH') {
                    usersModel.find({ 'contest.hackerearth': true }, (err, user) => {
                        logoUrl='https://raw.githubusercontent.com/codestromer/ContestReminder/master/Reminder-Mail/hackerearth.png';
                        sendReminder(user, contest,logoUrl);
                    });
                }
                else if (contest.Platform == 'CODECHEF') {
                    usersModel.find({ 'contest.codechef': true }, (err, user) => {
                        logoUrl="https://raw.githubusercontent.com/codestromer/ContestReminder/master/Reminder-Mail/codechef.png";
                        sendReminder(user, contest,logoUrl);
                    });
                }
                else if (contest.Platform == 'HACKERRANK') {
                    usersModel.find({ 'contest.hackerrank': true }, (err, user) => {
                        logoUrl='https://raw.githubusercontent.com/codestromer/ContestReminder/master/Reminder-Mail/hackerrank.png';
                        sendReminder(user, contest,logoUrl);
                    });
                }
                else if (contest.Platform == 'SPOJ') {
                    usersModel.find({ 'contest.spoj': true }, (err, user) => {
                        logoUrl='https://github.com/codestromer/ContestReminder/blob/master/Reminder-Mail/spoj.jfif?raw=true';
                        sendReminder(user, contest,logoUrl);
                    });
                }

            }
        });
    });
}
// setInterval(findUser, 15*60*1000); //repeate after interval of 15 minutes find (contest,user) and send reminder



//function to send reminder
function sendReminder(user, contest,logoUrl) {

    let cid=contest._id;
    reminderedContest[cid]=true;

    let emails = "";        // email list of users

    for (i = 0; i < user.length; i++) {
        emails += user[i].email;
        emails += ',';
    }
    // console.log(emails);

    //Email html formet (messege)
    let messege = `<!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .main{
                            display: inline-block;
                            width: 350px;
                            height: 400px;
                        }
                        img{
                            margin-left: 115px;
                            margin-top:10px;
                        }
                        a{
                            margin-left: 75px;
                            font-size: larger;
                            font-weight: 700;
                        }
                        h4{
                            text-align: center;
                            color: tomato;
                        }
                    </style>
                </head>

                <body>
                    <div style="background-color: white;border: 2px solid rgb(30, 41, 37);" class="main">
                        <img src="${logoUrl}" height="120px" width="120px">
                        <hr>
                        <h3 style="text-align: center;"><b>${contest.Name}</b></h3>
                        <hr>
                        <span style="margin-left: 25px; margin-bottom:20px; margin-top:20px"> <b>StartTime </b><span style='font-size:15px;'>&#8986;</span> : ${contest.StartTime}</span><br>
                        <span style="margin-left: 25px; margin-bottom:20px"><b>Duration </b> <span style='font-size:15px;'>&#8987;</span> : ${contest.Duration}</span><br>
                        <span style="margin-left: 25px; margin-bottom:20px"><b>EndTime </b><span style='font-size:15px;'>&#10062;</span> : ${contest.EndTime}</span>
                        <hr>
                        <a href="${contest.url}" target="_blank"><span style='font-size:20px;'>&#10002;</span> Contest Link </a>
                        <hr>
                        <h4>< ALL THE BEST! ></h4>
                        <h4>< HAPPY CODING! ></h4>
                    
                    </div>

                </body>

                </html>`;
                
    // send reminder through email
    if(emails!=""){
        sendEmail(emails, messege);     
    }
       
}


//email sender function 
function sendEmail(emailIdList, messege) {
    let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        service: 'gmail',
        auth: {
            user: 'princeal3855@gmail.com',
            pass: 'iazqrvqsujmlpgfo',
        }
    });
    const message = {
        from: 'princeal3855@gmail.com', // Sender address
        to: emailIdList,         // List of recipients
        subject: 'Contest will start soon !', // Subject line
        html: messege, // html email 
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });

}
