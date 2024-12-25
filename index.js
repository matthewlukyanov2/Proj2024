var express = require('express');
var mysqlDAO = require('./models/mysqlDao'); // MySQL functions
var mongoDAO = require('./models/mongoDao'); // MongoDB functions

var app = express();

// Start the server
app.listen(3004, () => {
    console.log("Running on port 3004");
});