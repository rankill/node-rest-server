const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('mongoose');

app.post('/login', async (req, res) => {
    try {
        const {body} = req
        const {email, password = ''} = body
    
        const user = await User.findOne({
            email
        })
    
        if (!user || !bcrypt.compareSync(password, user.password))  {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User or password error"
                }
            })
        }

        const token = jwt.sign({
            user
        }, process.env.SEED, {expiresIn: 60 * 60 * 24 * 30}) // 30 days


        res.json({
            ok: true,
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            err: error
        })
    }
   
})

module.exports = app;