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
    // Sort by lecturer ID
    return Lecturer.find().sort({_id: 1}); 
};

// Function to insert or delete lecturers 
module.exports = { getLecturers };


