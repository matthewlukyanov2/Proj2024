const express = require('express');
const mysqlDAO = require('../models/mysqlDao'); 
const router = express.Router();

// Route to fetch all students (GET /students)
router.get('/', (req, res) => {
    mysqlDAO.getStudents()
    .then((students) => {
        let studentList = students.map(student => `<li>${student.name} (ID: ${student.sid})</li>`).join(""); 
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Students</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        text-align: center;
                        padding: 20px;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    li {
                        margin: 5px 0;
                        padding: 10px;
                        background-color: #e7f3e7;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        text-decoration: none;
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: white;
                        border-radius: 5px;
                    }
                    a:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <h1>Students</h1>
                <ul>
                    ${studentList}
                </ul>
                <a href="/">Back to Home</a>
            </body>
            </html>
        `);
    })
    .catch((error) => {
        console.error("Error fetching students:", error.stack);
        res.status(500).send("<p>Error fetching students</p>");
    });
});

// Export the router for the main app 
module.exports = router;

