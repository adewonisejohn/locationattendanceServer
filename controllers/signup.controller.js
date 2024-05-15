const express = require("express");
const router = express.Router();
const UserModel = require('../models/userModel'); // Import student model
const AdminModel = require('../models/adminModel'); // Import admin model

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Student Signup Route
router.post("/student", async (req, res) => {
    try {
        const { full_name , matric_number, department, password} = req.body;
        const newUser = new UserModel({
            full_name,
            matric_number,
            department,
            password
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            status : true,
            data : savedUser
        });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

// Admin Signup Route
router.post("/admin", async (req, res) => {
    try {
        const { first_name, last_name, password} = req.body;
        const newAdmin = new AdminModel({
            first_name,
            last_name,
            password,
        });
        const savedAdmin = await newAdmin.save();
        res.status(201).json({
            status : true,
            data  : savedAdmin
        });
    } catch (error) {
        res.status(400).json({status: false, message: error.message });
    }
});

module.exports = router;
