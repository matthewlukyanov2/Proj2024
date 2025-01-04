const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MySQL connection setup using your `proj2024mysql` database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // Your MySQL username
  password: 'Cooldude123!', // Your MySQL password
  database: 'proj2024mysql' // Your database name
});

// Routes

//Display all students GET /students
app.get('/students', (req, res) => {
  pool.query('SELECT * FROM student ORDER BY sid ASC', (err, results) => {
    if (err) throw err;
    res.render('students', { students: results });
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

//Show Edit Student form GET /students/edit/:sid
app.get('/students/edit/:sid', (req, res) => {
  const sid = req.params.sid;
  pool.query('SELECT * FROM student WHERE sid = ?', [sid], (err, result) => {
    if (err) throw err;
    res.render('editStudent', { student: result[0], error: null });
  });
});

//Handle Edit Student form submission POST /students/edit/:sid
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
  res.send('<h1>Welcome to the Students Database</h1><a href="/students">Go to Students Page</a>');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
