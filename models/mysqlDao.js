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

