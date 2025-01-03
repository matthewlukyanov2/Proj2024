const pmysql = require('promise-mysql');

// Create MySQL pool
let pool;

pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root', //MySQL user
    password: 'Cooldude123!', //MySQL password
    database: 'proj2024mysql', //Database
})
.then((p) => {
    pool = p;
})
.catch((e) => {
    console.log("Pool error: " + e);
});

// Function to fetch students from the MySQL database
var getStudents = function() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student ORDER BY sid')
        .then((data) => {
            console.log(data);// added line
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    });
};

// Function to check if a student exists by id or other criteria
var studentExists = function(criteria) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM student WHERE ';
        let queryParams = [];
        
        // Build query dynamically based on the criteria object
        Object.keys(criteria).forEach((key, index) => {
            query += `${key} = ?`;
            queryParams.push(criteria[key]);
            if (index < Object.keys(criteria).length - 1) {
                query += ' AND ';
            }
        });

        pool.query(query, queryParams)
        .then((data) => {
            if (data.length > 0) {
                resolve(true); // Student found
            } else {
                resolve(false); // Student not found
            }
        })
        .catch((error) => {
            reject(error);
        });
    });
};

//CRUD operations
module.exports = { getStudents };