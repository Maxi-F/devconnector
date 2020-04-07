require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect to the Database
connectDB();

const PORT = process.env.PORT || 5010;

// Init Middleware to parse body
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api', require('./routes/api/index'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
