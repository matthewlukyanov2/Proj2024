const pmysql = require('promise-mysql');

// Create MySQL pool
let pool;

pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root', // MySQL user
    password: 'Cooldude123!', // MySQL password
    database: 'proj2024mysql', // Database
})
.then((p) => {
    pool = p;
})
.catch((e) => {
    console.log("Pool error: " + e);
});

// Function to fetch all students
var getStudents = function() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student ORDER BY sid')
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    });
};

// Function to create a student
var createStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', 
            [studentData.sid, studentData.name, studentData.age]
        )
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            console.error("MySQL Insert Error:", error);
            reject(error);
        });
    });
};


// Function to delete a student by id
var deleteStudent = function(studentId) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM student WHERE sid = ?', [studentId])
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
};

module.exports = { getStudents, createStudent, deleteStudent };
