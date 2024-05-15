const express = require("express");
const app = express();
require('dotenv').config();
const path = require('path'); // Include the path module
const fs = require('fs')
const { initDb } = require('./configurations/databaseInit');
const createDefaultAdmin = require('./configurations/createAdmin'); // Change this line
initDb();
createDefaultAdmin();

const port = 500; // Changed port number to avoid potential conflicts
const signInController = require("./controllers/signin.controller");
const signUpController = require("./controllers/signup.controller");
const adminController = require("./controllers/admin.controller");

app.use(express.json());
app.use(express.static('public'))
app.set('view engine', 'ejs');



app.get("/", function(req, res) {
  res.send("Hello world");
});


app.get('/attendance', (req, res) => {
  const directoryPath = path.join(__dirname, 'public', 'attendanceList');

  // Read file names in the directory
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          console.error('Error reading directory:', err);
          res.status(500).send('Internal server error');
      } else {
          // Render EJS template with file names
          res.render('attendance', { files });
      }
  });
});


// Route to download a specific file
app.get('/attendance/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'public', 'attendanceList', fileName);

  // Check if the file exists
  fs.exists(filePath, (exists) => {
      if (exists) {
          // Set content disposition to attachment to force download
          res.attachment(fileName);
          // Send the file
          res.sendFile(filePath);
      } else {
          res.status(404).send('File not found');
      }
  });
});

app.use("/signin", signInController);
app.use("/signup", signUpController);
app.use("/admin", adminController);


app.get("/test",function(req,res){
  return res.json({
    status : true
  })
})

app.listen(port, console.log(`Server started on port ${port}`));
