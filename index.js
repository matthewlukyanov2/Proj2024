var express = require('express');
var bodyParser = require('body-parser'); // Middleware for parsing JSON
var studentRoutes = require('./routes/studentRoutes'); // Import student routes
var lecturerRoutes = require('./routes/lecturerRoutes'); // Import lecturer routes

var app = express();

// Handle JSON requests
app.use(bodyParser.json());

// Use the imported routes
app.use('/students', studentRoutes); // All routes starting with /students will use studentRoutes.js
app.use('/lecturers', lecturerRoutes); // All routes starting with /lecturers will use lecturerRoutes.js

// Home route (GET /)
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home Page</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f9;
                    color: #333;
                }
                h1 {
                    color: #4CAF50;
                    margin-top: 20px;
                }
                nav {
                    margin: 20px 0;
                }
                nav a {
                    text-decoration: none;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border-radius: 5px;
                    margin: 0 10px;
                    transition: background-color 0.3s ease;
                }
                nav a:hover {
                    background-color: #45a049;
                }
                footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to the Home Page</h1>
            <nav>
                <a href="/lecturers">View Lecturers</a>
                <a href="/students">View Students</a>
            </nav>
        </body>
        </html>
    `);
});

// Start the server
app.listen(3004, () => {
    console.log("Running on port 3004");
});
