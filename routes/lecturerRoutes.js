const express = require('express');
const mongoDAO = require('../models/mongoDao'); // MongoDB functions
const router = express.Router();

// Route to fetch lecturers (GET /lecturers)
router.get('/', (req, res) => {
    mongoDAO.getLecturers()
    .then((lecturers) => {
        let lecturerList = lecturers.map(lecturer => `<li>${lecturer.name} (ID: ${lecturer._id})</li>`).join("");
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lecturers</title>
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
                <h1>Lecturers</h1>
                <ul>
                    ${lecturerList}
                </ul>
                <a href="/">Back to Home</a>
            </body>
            </html>
        `);
    })
    .catch((error) => {
        console.error("Error fetching lecturers:", error.stack);
        res.status(500).send("<p>Error fetching lecturers</p>");
    });
});

// Route to add a new lecturer (POST /lecturers)
router.post('/', (req, res) => {
    const { _id, name, did } = req.body;

    // Validation
    if (!_id || !name || !did) {
        return res.status(400).json({ error: "All fields (_id, name, did) are required" });
    }

    if (_id.length !== 24) {
        return res.status(400).json({ error: "Invalid ID format. It must be 24 characters long." });
    }

    const newLecturer = new mongoDAO.Lecturer({
        _id,
        name,
        did
    });

    newLecturer.save()
    .then(() => {
        res.status(201).json({ message: "Lecturer added successfully!" });
    })
    .catch((error) => {
        console.error("Error adding lecturer:", error.stack);
        res.status(500).json({ error: "Error adding lecturer" });
    });
});

// Export the router so it can be used in the main app
module.exports = router;

