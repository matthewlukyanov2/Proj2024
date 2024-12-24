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
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    });
};

//CRUD operations
module.exports = { getStudents };