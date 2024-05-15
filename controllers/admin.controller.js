const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel'); // Import the Admin model

// PUT route to start attendance
router.use(express.json())
router.use(express.urlencoded({ extended: true }));


router.get('/status',async(req,res) => {
    var admin = await Admin.findOne({});

    return res.json({
        status : admin.attendance_in_progress
    })
})
router.post('/start', async (req, res) => {
    try {
        // Extract latitude, longitude, course code, and distance from request body
        const { latitude, longitude, course_code, distance } = req.body;

        // Update the admin's attendance status, location, course code, and distance
        await Admin.updateOne({}, {
            attendance_in_progress: true,
            location: [parseFloat(latitude), parseFloat(longitude)],
            course_code: course_code,
            distance: distance
        });

        res.status(200).json({
            status: true,
            message: 'Attendance started successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
});


// PUT route to stop attendance
router.post('/stop', async (req, res) => {
    try {
        // Find and update the admin's attendance status
        await Admin.updateOne({}, { attendance_in_progress: false });

        res.status(200).json({
            status : true,
             message: 'Attendance stopped successfully' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status : false,
             error: 'Internal server error'
        });
    }
});

module.exports = router;
