const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('./config/config')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/user', function(req, res) {
    res.json('get User')
})

app.post('/user', function(req, res) {
    console.log(req)
    const { name } = req.body
    if (!name) {
        res.status(400).json({
            ok: false,
            msg: 'Name is required'
        })
    }

    res.json(req.body)
})

app.put('/user/:id', function(req, res) {
    const {id} = req.params
    res.json({
        id
    })
})

app.delete('/user', function(req, res) {
    res.json('delete User')
})


app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}...`))