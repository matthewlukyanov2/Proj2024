const mongoose = require('mongoose');

// MongoDB Atlas connection string
const uri = "mongodb+srv://brucedog9:Cooldude123!@cluster0.gjkb2.mongodb.net/proj2024MongoDB?retryWrites=true&w=majority&appName=Cluster0"; // Use your database name here

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
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
    return Lecturer.find().sort({_id: 1});  // Sorted by ID
};

// Get a lecturer by ID
var getLecturerById = function(id) {
    return Lecturer.findById(id);  // Using Mongoose's `findById()` method
};

// Update a lecturer's details
var updateLecturer = function(id, updatedData) {
    return Lecturer.findByIdAndUpdate(id, updatedData, { new: true });  // Update and return the updated document
};

// Delete a lecturer
var deleteLecturer = function(id) {
    return Lecturer.findByIdAndDelete(id);  // Delete lecturer by ID
};

// Function to add a new lecturer
var addLecturer = function (lecturerData) {
    return new Lecturer(lecturerData).save();
};

// Export the functions
module.exports = { 
    addLecturer,
    getLecturers, 
    getLecturerById, 
    updateLecturer, 
    deleteLecturer 
};
