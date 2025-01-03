const express = require('express');
const mysqlDAO = require('../models/mysqlDao');
const router = express.Router();

// Route to fetch all students (GET /students)
router.get('/', (req, res) => {
    mysqlDAO.getStudents()
    .then((students) => {
        let studentList = students.map(student => `<li>${student.name} (ID: ${student.sid}) <button onclick="deleteStudent('${student.sid}')">Delete</button></li>`).join("");
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Students</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    ul { list-style-type: none; padding: 0; }
                    li { margin: 5px 0; padding: 10px; background-color: #e7f3e7; }
                    button { background-color: red; color: white; padding: 5px 10px; border: none; cursor: pointer; }
                </style>
            </head>
            <body>
                <h1>Students</h1>
                <ul>${studentList}</ul>
                <a href="/students/add">Add Student</a>
                <script>
                    function deleteStudent(sid) {
                        fetch('/students/delete/' + sid, { method: 'DELETE' })
                        .then((response) => {
                            if (response.ok) {
                                window.location.reload();
                            } else {
                                alert("Error deleting student");
                            }
                        });
                    }
                </script>
            </body>
            </html>
        `);
    })
    .catch((error) => {
        console.error("Error fetching students:", error.stack);
        res.status(500).send("<p>Error fetching students</p>");
    });
});

// Route to add a new student (GET /students/add)
router.get('/add', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Add Student</title>
        </head>
        <body>
            <h1>Add Student</h1>
            <form action="/students/add" method="POST">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br><br>
                <label for="age">Age:</label>
                <input type="number" id="age" name="age" required><br><br>
                <label for="departmentId">Department ID:</label>
                <input type="text" id="departmentId" name="departmentId" required><br><br>
                <button type="submit">Add Student</button>
            </form>
        </body>
        </html>
    `);
});

router.post('/add', (req, res) => {
    const { name, age, departmentId } = req.body;
    
    console.log("Received data:", req.body); // Log the incoming data

    if (!name || !age || !departmentId) {
        return res.status(400).send("<p>All fields are required.</p>");
    }

    mysqlDAO.createStudent({ name, age, departmentId })
    .then(() => {
        res.redirect('/students');
    })
    .catch((error) => {
        console.error("Error creating student:", error.stack); // Log error
        res.status(500).send("<p>Error creating student</p>");
    });
});


// Route to delete a student (DELETE /students/delete/:sid)
router.delete('/delete/:sid', (req, res) => {
    const studentId = req.params.sid;

    mysqlDAO.deleteStudent(studentId)
    .then(() => {
        res.send({ success: true });
    })
    .catch((error) => {
        console.error("Error deleting student:", error.stack);
        res.status(500).send({ success: false, error: error.message });
    });
});

module.exports = router;
