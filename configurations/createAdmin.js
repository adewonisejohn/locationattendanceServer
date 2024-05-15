const adminModel = require('../models/adminModel');

async function createDefaultAdmin() {
  try {
    const existingAdmins = await adminModel.find();
    if (existingAdmins.length === 0) {
      const defaultAdmin = {
        full_name: 'admin',
        password: 'password',
        location: [0, 0],
        attendance_in_progress : false
      };
      await adminModel.create(defaultAdmin);
      console.log('Default admin created successfully.');
    } else {
      console.log('Admin already exists. Skipping creation of default admin.');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

// Exporting the function directly
module.exports = createDefaultAdmin;
