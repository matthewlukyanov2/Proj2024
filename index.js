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
        res.status(500).json(error);  
    });
});

// Route to fetch lecturers (GET /lecturers)
app.get("/lecturers", (req, res) => {
    //Sets Default limit
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    mongoDAO.getLecturers({ skip, limit })
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

    
});

// Save the lecturer to the database
newLecturer.save()
.then(() => {
    res.status(201).json({ message: "Lecturer added successfully!" });
})
.catch((error) => {
    console.error("Error adding lecturer:", error.stack);
    res.status(500).json("Error adding lecturer");
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
        app.put("/lecturers/:id", (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            if (!updatedData || Object.keys(updatedData).length === 0) {
                return res.status(400).json({ error: "No update data provided." });
            }

            mongoDAO.Lecturer.findOne({ _id: id })
        .then((lecturer) => {
            if (!lecturer) {
                return res.status(404).json({ error: `Lecturer with ID ${id} not found.` });
            }
            

           return mongoDAO.Lecturer.updateOne({ _id: id }, { $set: updatedData })
            .then(() => {
                res.json({ message: `Lecturer with ID ${id} updated successfully.` });
            })
            .catch((error) => {
                console.error("Error updating lecturer:", error.stack);
                res.status(500).json("Error updating lecturer");
            });
        });

});
