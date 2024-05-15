const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Assuming 'Admin' is the name of the model referencing the admin ID
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        requied : true
    },
    courseCode: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming 'Student' is the name of the model referencing the student ID
    }]
});

const attendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = attendanceModel;
