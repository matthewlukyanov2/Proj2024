const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Atlas connection string
const uri = "mongodb+srv://brucedog9:Cooldude123!@cluster0.gjkb2.mongodb.net/proj2024MongoDB?retryWrites=true&w=majority&appName=Cluster0"; 

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// MongoDB schema for Module 
const moduleSchema = new mongoose.Schema({
  mid: { type: String, required: true },
  name: { type: String, required: true },
  lecturer: { type: String, required: true }
});

// Define the Module model
const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema);

// MongoDB schema for Lecturer
const lecturerSchema = new mongoose.Schema({
  lid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  did: { type: String, required: true },
});

// Define the Lecturer model
const Lecturer = mongoose.model('Lecturer', lecturerSchema);

// Routes
//Display all lecturers 
app.get('/lecturers', async (req, res) => {
    const searchQuery = req.query.search || '';  // Get the search term from the query string
    try {
      // Search by lid or name if there's a search query, otherwise get all lecturers
      const lecturers = await Lecturer.find({
        $or: [
          { lid: { $regex: searchQuery, $options: 'i' } },  // Case-insensitive regex search for lid
          { name: { $regex: searchQuery, $options: 'i' } }  // Case-insensitive regex search for name
        ]
      }).sort({ lid: 1 });  // Sort by lid
  
      res.render('lecturers', { lecturers, searchQuery });  // Pass search term back to the view for rendering
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching lecturers');
    }
  });

//Handle delete lecturer from lid
app.get('/lecturers/delete/:lid', async (req, res) => {
    const lid = req.params.lid;  // Get lid (which will be the ObjectId here)
    console.log(`Attempting to delete lecturer with lid (ObjectId): "${lid}"`);

    try {
        // Convert the lid to ObjectId 
        const lecturerId = new mongoose.Types.ObjectId(lid); 

        // Delete lecturer by _id 
        const deleteResult = await Lecturer.findOneAndDelete({ _id: lecturerId });

        if (!deleteResult) {
            console.log(`No lecturer found with _id ${lecturerId}`);
            return res.status(404).send('Lecturer not found');
        }

        console.log(`Lecturer with _id ${lecturerId} has been deleted.`);
        res.redirect('/lecturers');  
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
  

// MySQL connection setup 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // Your MySQL username
  password: 'Cooldude123!', // Your MySQL password
  database: 'proj2024mysql' // Your database name
});

// Routes
//Display all students GET /students
app.get('/students', (req, res) => {
    const searchQuery = req.query.search || '';  // Get the search term from the query string
    let query = 'SELECT * FROM student WHERE 1=1';  // Default query
    
    // Add conditions if there's a search term
    if (searchQuery) {
      query += ` AND (sid LIKE '%${searchQuery}%' OR name LIKE '%${searchQuery}%' OR age LIKE '%${searchQuery}%')`;
    }
    
    query += ' ORDER BY sid ASC';  // Sort by sid
    
    pool.query(query, (err, results) => {
      if (err) throw err;
      res.render('students', { students: results, searchQuery });  // Pass searchQuery to view
    });
  });
  

//Show Add Student form GET /students/add
app.get('/students/add', (req, res) => {
  res.render('addStudent', { error: null });
});

//Handle Add Student form submission POST /students/add
app.post('/students/add', (req, res) => {
  const { sid, name, age } = req.body;

  // Validation checks
  if (sid.length !== 4) {
    return res.render('addStudent', { error: "Student ID must be 4 characters" });
  }
  if (name.length < 2) {
    return res.render('addStudent', { error: "Name must be at least 2 characters long" });
  }
  if (age < 18) {
    return res.render('addStudent', { error: "Age must be 18 or older" });
  }

  // Check if the student ID already exists
  pool.query('SELECT * FROM student WHERE sid = ?', [sid], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.render('addStudent', { error: "Student with this ID already exists" });
    }

    // Add student to the database
    pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', 
      [sid, name, age], (err) => {
        if (err) throw err;
        res.redirect('/students'); 
    });
  });
});

//Show Edit Student form sid
app.get('/students/edit/:sid', (req, res) => {
  const sid = req.params.sid;
  pool.query('SELECT * FROM student WHERE sid = ?', [sid], (err, result) => {
    if (err) throw err;
    res.render('editStudent', { student: result[0], error: null });
  });
});

//Handle Edit Student form submission sid
app.post('/students/edit/:sid', (req, res) => {
  const sid = req.params.sid;
  const { name, age } = req.body;

  // Validation checks
  if (name.length < 2) {
    return res.render('editStudent', { 
      student: { sid, name, age },
      error: "Name must be at least 2 characters long"
    });
  }
  if (age < 18) {
    return res.render('editStudent', { 
      student: { sid, name, age },
      error: "Age must be 18 or older"
    });
  }

  // Update student details in the database
  pool.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', 
    [name, age, sid], (err) => {
      if (err) throw err;
      res.redirect('/students'); 
  });
});

//Home route GET /
app.get('/', (req, res) => {
  res.send(`
    <h1>G00421514</h1>
    <a href="/students">Go to Students Page</a><br>
    <a href="/grades">Go to Grades Page</a>
    <a href="/lecturers">Go to Lecturers Page</a>
  `);
});

//Display grades GET /
app.get('/grades', (req, res) => {
    const sql = `
        SELECT students.name AS student_name, 
               module.name AS module_name, 
               grade.grade
        FROM student AS students
        LEFT JOIN grade ON students.sid = grade.sid
        LEFT JOIN module ON grade.mid = module.mid
        ORDER BY students.name ASC, grade.grade ASC;
    `;
    
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server Error");
        }

        // Organize the results by student name
        const studentGrades = results.reduce((acc, row) => {
            if (!acc[row.student_name]) {
                acc[row.student_name] = [];
            }
            if (row.module_name) {
                acc[row.student_name].push({ module: row.module_name, grade: row.grade });
            }
            return acc;
        }, {});

        // Send the organized data to the grades view
        res.render('grades', { studentGrades });
    });
});

// Start the server
app.listen(3004, () => {
  console.log('Server is running on http://localhost:3004');
});
