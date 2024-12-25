var express = require('express');
var mysqlDAO = require('./models/mysqlDao'); // MySQL functions
var mongoDAO = require('./models/mongoDao'); // MongoDB functions

var app = express();

// Start the server
app.listen(3004, () => {
    console.log("Running on port 3004");
});

// Home route (GET /)
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Home Page</h1>");
});

// Route to fetch students (GET /students)
app.get("/students", (req, res) => {
    mysqlDAO.getStudents()
    .then((data) => {
        res.json(data);  
    })
    .catch((error) => {
        res.status(500).send(error);  
    });
});

// Route to fetch lecturers (GET /lecturers)
app.get("/lecturers", (req, res) => {
    mongoDAO.getLecturers()
    .then((data) => {
        res.json(data);  
    })
    .catch((error) => {
        res.status(500).send(error); 
    });
});