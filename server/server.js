const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('./config/config');


const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(require('./routes/index'));

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log('MongoDB Connected…')
    })
    .catch(err => console.log(err))

app.listen(process.env.PORT, () => {
    console.log('Port-->: ', process.env.PORT);
});