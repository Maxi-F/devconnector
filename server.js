require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect to the Database
connectDB();

const PORT = process.env.PORT || 5010;

// Init Middleware to parse body
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
