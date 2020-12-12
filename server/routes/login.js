const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('mongoose');
const {OAuth2Client} = require('google-auth-library');
const { result } = require('underscore');
const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

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
// Google conf
async function verify(idToken) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENTID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    const {name, email, picture: img} = payload
    
    return {
        name,
        email,
        img,
        google: true
    }
}

app.post('/google', async (req, res) => {
    try {
        const { body } = req
        const { idtoken } = body

        const googleUser = await verify(idtoken).catch(err => {
            res.status(403).json({
                ok: false,
                err
            })
        })

        console.log(googleUser);

        const user = await User.findOne({email: googleUser.email})
        
        if (user) {
            if (!user.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Must use email/password auth'
                    }
                })
            } else {
                const token = jwt.sign({
                    user
                }, process.env.SEED, {expiresIn: 60 * 60 * 24 * 30}) // 30 days

                return res.json({
                    ok: true,
                    user,
                    token
                })
            }
        } else {
            // If user does not exist on our DB
            const user = new User(googleUser);
            user.password = ':)'

            console.log(user)

            const userCreated = await user.save();

            const token = jwt.sign({
                user
            }, process.env.SEED, {expiresIn: 60 * 60 * 24 * 30}) // 30 days

            return res.json({
                ok: true,
                user: userCreated,
                token
            })
        }

        res.json({
            googleUser
        })
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

module.exports = app;