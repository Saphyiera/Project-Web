import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_URI;

// Database Connection with MongoDB
const connection = mongoose.connect(uri)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

export default connection;