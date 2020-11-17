const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const validAuth = async (req, res, next) => {
    try {
        const authorization = req.get('Authorization') || ''
        const [type, token] = authorization.split(' ')
        console.log(token)
       
        const decoded = await jwt.verify(token, process.env.SEED)
    
        req.user = decoded.user

        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Access denied'
            }
        })
    }
   
}

const isAdminRole = (req, res, next) => {
    const { user } = req

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'You cannot create users'
            }
        })  
    }

    next()

    console.log(user)
}

module.exports = {
    validAuth,
    isAdminRole
}