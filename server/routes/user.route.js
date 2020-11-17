const e = require('express');
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { validAuth, isAdminRole } = require('../middlewares/auth');


app.get('/users', validAuth, async (req, res) => {
    try {
        const {from = 0, to = 5} = req.query
        const q = {status: true}

        const users = await User.find(q, 'name email role status google img')
                                .skip(Number(from))
                                .limit(Number(to))
                                .exec()
        
        const count = await User.countDocuments(q).skip(Number(from))
        .limit(Number(to))
        .exec()

        res.json({
            ok: true,
            users,
            count
        }) 

    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        })
    }
   
});

app.post('/users', [validAuth, isAdminRole], (req, res) => {

    let {body} = req;
    const { name, email, password, role } = body
    let user = new User({
        name,
        email, 
        password: bcrypt.hashSync(password, 10), 
        role
    })

    user.save((err, userDB) => {
        if(err) return res.status(400).json({
            ok: false,
            err
        })
    
        res.json({
            ok: true,
            user: userDB
        }) 

    })
});

app.put('/users/:id', validAuth, (req, res) => {

    const {body, params} = req
    const {id} = params;

    _.pick(body,  ['name', 'email', 'img',  'role', 'status'])

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, useFindAndModify: false}, (err, userDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        })
        
        res.json({
            ok: true,
            user: userDB
        });
    })
});

app.delete('/users/:id', validAuth, async (req, res) => {
    try {
        const {id} = req.params;
        const q = {
            status: false
        }
    
        const deletedUser = await User.findByIdAndUpdate(id, q, {new: true, useFindAndModify: false})

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            })
        }

        res.json({
            ok: true,
            user: deletedUser
        });


    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        })
    }
   
});

module.exports = app