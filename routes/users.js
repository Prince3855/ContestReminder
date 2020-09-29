const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://prince3855:Prince3855@mydb.9yyd1.mongodb.net/userData?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true,useFindAndModify: false});

let db=mongoose.connection;

const userSchema = new mongoose.Schema({
    userName: {
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    email: {
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    password: {
        type:String,
        required:true,
    },
    contest :{
        codechef:{ type:Boolean , default:true },
        codeforces:{ type:Boolean , default:true },
        spoj:{ type:Boolean , default:true },
        hackerearth:{ type:Boolean , default:true },
        hackerrank:{ type:Boolean , default:true },
    },
});

const users = mongoose.model('users', userSchema);

module.exports=users;