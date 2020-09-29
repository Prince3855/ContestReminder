const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://prince3855:Prince3855@mydb.9yyd1.mongodb.net/userData?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true});

let db=mongoose.connection;

const contestSchema = new mongoose.Schema({
   Name : String,
   url : String,
   Platform : String,
   StartTime : String,
   EndTime : String,
   Duration : String,
    challenge_type :{
       type:String,
       required: false
   }
});

const contest = mongoose.model('contest', contestSchema);

module.exports=contest;