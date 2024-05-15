const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({

    full_name : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    location : {
       type :  [Number],
    },
    attendance_in_progress : {
        type : Boolean
    },
    course_code : {
        type : String,
    },
    distance : {
        type: String
    }

})

const adminModel = mongoose.model('Admin',adminSchema)


module.exports = adminModel