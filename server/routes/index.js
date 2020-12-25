const express = require('express');
const app = express();

const userRoutes = require('./user.route')
const categoryRoutes = require('./category')
const productRoutes = require('./product')
const loginRoutes = require('./login')

app.use(userRoutes)
app.use(categoryRoutes)
app.use(productRoutes)
app.use(loginRoutes)

module.exports = app