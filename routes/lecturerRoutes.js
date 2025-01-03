const mongoose = require('mongoose');


var express = require('express');
var mongoDAO = require('../models/mongoDao');
var router = express.Router();

// Route to fetch all lecturers
router.get('/', (req, res) => {
    mongoDAO.getLecturers()
    .then((lecturers) => {
        let lecturerList = lecturers.map(lecturer => 
            `<li>${lecturer.name} (ID: ${lecturer._id}) 
                <a href="/lecturers/edit/${lecturer._id}">Edit</a> 
                <a href="/lecturers/delete/${lecturer._id}">Delete</a>
            </li>`
        ).join("");
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
                        margin-top: 10px;
                        text-decoration: none;
                        padding: 5px 10px;
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
                <a href="/lecturers/add">Add New Lecturer</a>
            </body>
            </html>
        `);
    })
    .catch((error) => {
        console.error("Error fetching lecturers:", error.stack);
        res.status(500).send("<p>Error fetching lecturers</p>");
    });
});

// Route to show the form to add a new lecturer (GET /lecturers/add)
router.get('/add', (req, res) => {
    res.send(`
        <h1>Add New Lecturer</h1>
        <form action="/lecturers/add" method="POST">
            <label for="name">Name:</label>
            <input type="text" name="name" required><br><br>
            <label for="did">Department ID:</label>
            <input type="text" name="did" required><br><br>
            <button type="submit">Add Lecturer</button>
        </form>
        <a href="/lecturers">Back to Lecturers List</a>
    `);
});

// Route to handle adding a new lecturer (POST /lecturers/add)
router.post('/add', (req, res) => {
    const { name, did } = req.body;

    if (!name || !did) {
        return res.status(400).send("Missing required fields");
    }

    const newLecturer = {
        _id: new mongoose.Types.ObjectId(),  // Use a new ObjectId
        name: name,
        did: did
    };

    mongoDAO.addLecturer(newLecturer)
    .then(() => {
        res.redirect('/lecturers');
    })
    .catch((error) => {
        console.error("Error adding lecturer:", error.stack);
        res.status(500).send("<p>Error adding lecturer</p>");
    });
});

// Route to show the form to edit a lecturer (GET /lecturers/edit/:id)
router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    mongoDAO.getLecturerById(id)  // Fetch the lecturer by ID
    .then((lecturer) => {
        if (lecturer) {
            res.send(`
                <h1>Edit Lecturer</h1>
                <form action="/lecturers/edit/${lecturer._id}" method="POST">
                    <input type="text" name="name" value="${lecturer.name}" required>
                    <input type="text" name="did" value="${lecturer.did}" required>
                    <button type="submit">Save Changes</button>
                </form>
                <a href="/lecturers">Back to Lecturers List</a>
            `);
        } else {
            res.status(404).send("Lecturer not found");
        }
    })
    .catch((error) => {
        console.error("Error fetching lecturer:", error.stack);
        res.status(500).send("<p>Error fetching lecturer</p>");
    });
});

// Route to update a lecturer (POST /lecturers/edit/:id)
router.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, did } = req.body;

    if (!name || !did) {
        return res.status(400).send("Missing fields");
    }

    mongoDAO.updateLecturer(id, { name, did })
    .then(() => {
        res.redirect('/lecturers');
    })
    .catch((error) => {
        console.error("Error updating lecturer:", error.stack);
        res.status(500).send("<p>Error updating lecturer</p>");
    });
});

// Route to delete a lecturer (GET /lecturers/delete/:id)
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;

    mongoDAO.deleteLecturer(id)
    .then(() => {
        res.redirect('/lecturers');
    })
    .catch((error) => {
        console.error("Error deleting lecturer:", error.stack);
        res.status(500).send("<p>Error deleting lecturer</p>");
    });
});

module.exports = router;

