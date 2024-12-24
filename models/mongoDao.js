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


