const express = require('express');
const app = express();

app.use('/user', require('./user'));
app.use('/auth', require('./auth'));
app.use('/profile', require('./profile/profile'));
app.use('/posts', require('./posts'));

module.exports = app;
