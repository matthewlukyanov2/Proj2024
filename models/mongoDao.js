const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/proj2024MongoDB', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('MongoDB connection error:', error));

// Define the Lecturer schema
const lecturerSchema = new mongoose.Schema({
    _id: String,
    name: String,
    did: String
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);

// Fetch all lecturers from MongoDB
var getLecturers = function() {
    // Sort by lecturer ID
    return Lecturer.find().sort({_id: 1}); 
};

// Function to insert or delete lecturers 
module.exports = { getLecturers };


