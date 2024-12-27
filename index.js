var express = require('express');
var mysqlDAO = require('./models/mysqlDao'); // MySQL functions
var mongoDAO = require('./models/mongoDao'); // MongoDB functions
var bodyParser = require('body-parser'); // Middleware for parsing JSON

var app = express();

// Handle JSON requests
app.use(bodyParser.json());

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

// Route to add a new lecturer (POST /lecturers)
app.post("/lecturers", (req, res) => {
    const { _id, name, did } = req.body; 

    // Create a new lecturer document
    const newLecturer = new mongoDAO.Lecturer({
        _id,
        name,
        did
    });
});
