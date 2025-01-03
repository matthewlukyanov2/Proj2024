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

// Route to fetch students (GET /students)
app.get("/students", (req, res) => {
    mysqlDAO.getStudents()
    .then((students) => {
        let studentList = students.map(student => `<li>${student.name} (ID: ${student.id})</li>`).join("");
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

// Route to fetch lecturers (GET /lecturers)
app.get("/lecturers", (req, res) => {
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
app.post("/lecturers", (req, res) => {
    const { _id, name, did } = req.body; 

    // Validation
    if (!_id || !name || !did) {
        return res.status(400).json({ error: "All fields (_id, name, did) are required" });
    }

    if (_id.length !== 24) {
        return res.status(400).json({ error: "Invalid ID format. It must be 24 characters long." });
    }
    
    // Create a new lecturer document
    const newLecturer = new mongoDAO.Lecturer({
        _id,
        name,
        did
    });

// Save the lecturer to the database
newLecturer.save()
.then(() => {
    res.status(201).json({ message: "Lecturer added successfully!" });
})
.catch((error) => {
    console.error("Error adding lecturer:", error.stack);
    res.status(500).json({ error: "Error adding lecturer" });
 });
});


// Route to delete a lecturer 
app.delete("/lecturers/:id", async (req, res) => {
    try {
    const id = req.params.id;
    const lecturer = await mongoDAO.Lecturer.findOne({ _id: id });

    
            if (!lecturer) {
                return res.status(404).json({ error: `Lecturer with ID ${id} not found.` });
            }

            await mongoDAO.Lecturer.deleteOne({ _id: id });
            res.json({ message: `Lecturer with ID ${id} deleted successfully.` });
        }
        catch(error) {
            console.error("Error deleting lecturer:", error.stack);
            res.status(500).json({ error: "Error deleting lecturer" });
        }
        });

       // Route to update a lecturer
        app.put("/lecturers/:id", async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            if (!updatedData || Object.keys(updatedData).length === 0) {
                return res.status(400).json({ error: "No update data provided." });
            }

            try {
                const lecturer = await mongoDAO.Lecturer.findOne({ _id: id });
            if (!lecturer) {
                return res.status(404).json({ error: `Lecturer with ID ${id} not found.` });
            }
            

            await mongoDAO.Lecturer.updateOne({ _id: id }, { $set: updatedData });
                res.json({ message: `Lecturer with ID ${id} updated successfully.` });
            } catch (error) {
                console.error("Error updating lecturer:", error.stack);
                res.status(500).json({ error: "Error updating lecturer" });
            }
         });
        


