const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    full_name : {
        type : String,
        required : true
    },
    matric_number : {
        type : String,
        required : true,
        unique : true
    },
    gender : {
        type : String,
        enum : ['Male','Female'],
    },
    level : String,
    department : String,
    faculty : String,
    password : {
        type : String,
        required : true
    },
    location : {
       type :  [Number],

    }

})

const UserModel = mongoose.model('User',userSchema)

module.exports = UserModel