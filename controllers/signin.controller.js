const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel"); // Import student model
const AdminModel = require("../models/adminModel"); // Import admin model

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const ExcelJS = require('exceljs');

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

router.post("/student", async (req, res) => {
    try {
        const { matric_number, password, course_code, longitude, latitude } = req.body;

        // Convert latitude and longitude to float
        const studentLatitude = parseFloat(latitude);
        const studentLongitude = parseFloat(longitude);

        // Find the student by matric_number
        const student = await UserModel.findOne({ matric_number });
        const admin = await AdminModel.findOne(); // Assuming there's only one admin

        if (!admin.attendance_in_progress) {
            return res.status(401).json({ status: false, message: "Attendance has not started" });
        }

        if (!admin.course_code) {
            return res.status(401).json({ status: false, message: "Attendance has not started" });
        }

        // If student is not found or password is incorrect
        if (!student || student.password !== password) {
            return res.status(401).json({ status: false, message: "Invalid matric number or password" });
        }

        // Compare the distance between student's location and admin's location
        const distance = calculateDistance(studentLatitude, studentLongitude, admin.location[0], admin.location[1]);

        // Threshold distance in kilometers
        const thresholdDistance = admin.distance;
        if (distance > thresholdDistance) {
            return res.status(401).json({ status: false, message: "You are not within the allowed distance to sign in" });
        }

        // Generate file name based on admin's course code and current date
        const currentDate = moment().format('DD-MM-YYYY');
        const fileName = `${admin.course_code}-${currentDate}.xlsx`;

        // Define the directory path where the Excel file will be stored
        const directoryPath = path.join(__dirname, '..', 'public', 'attendanceList');

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Define the file path
        const filePath = path.join(directoryPath, fileName);

        // Load or create the workbook
        let workbook = new ExcelJS.Workbook();
        if (fs.existsSync(filePath)) {
            await workbook.xlsx.readFile(filePath);
        } else {
            workbook = new ExcelJS.Workbook();
        }

        // Get or create the worksheet
        let worksheet = workbook.getWorksheet('Attendance');
        if (!worksheet) {
            worksheet = workbook.addWorksheet('Attendance');
            // Add headers if this is a new worksheet
            worksheet.addRow(['Full Name', 'Matric Number', 'Department', 'Level']);
        }

        // Add student data
        worksheet.addRow([student.full_name, matric_number, student.department, student.level]);

        // Save the Excel file
        await workbook.xlsx.writeFile(filePath);

        // Respond to the client
        res.status(200).json({ status: true, message: "Student signed in successfully", student });
    } catch (error) {
        console.error("Error signing in student:", error.message);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

// Admin Sign-in Route
router.post("/admin", async (req, res) => {
    try {
        const { full_name, password } = req.body;

        // Find the admin by full name
        const admin = await AdminModel.findOne({ full_name });

        // If admin is not found or password is incorrect
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: "Invalid full name or password" });
        }

        // If admin is found and password is correct
        res.status(200).json({ message: "Admin signed in successfully", admin });
    } catch (error) {
        console.error("Error signing in admin:", error.message);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

module.exports = router;
