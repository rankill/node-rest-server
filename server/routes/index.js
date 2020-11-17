const express = require('express');
const app = express();

const userRoutes = require('./user.route')
const loginRoutes = require('./login')

app.use(userRoutes)
app.use(loginRoutes)

module.exports = app