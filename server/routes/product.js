const express = require('express');

const { validAuth }  = require('../middlewares/auth');

const app = express();

const  Product = require('../models/product')

const _ = require('underscore');


app.get('/products', [validAuth],  async (req, res) => {
    try {
        const {from = 0, to = 5} = req.query

        const products = await Product
                                .find({avaliable: true})
                                .skip(Number(from))
                                .limit(Number(to))
                                .sort('name')
                                .populate('category', 'description')
                                .populate('user', 'name email')
                                .exec()

        res.json({
            ok: true,
            products
        }) 

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})

app.get('/products/search/:keyword', [validAuth],  async (req, res) => {
    try {
        const {params} = req
        const {keyword} = params;

        let regEx = new RegExp(keyword, 'i')

        const products = await Product
                                .find({
                                    name: regEx
                                })
                                .sort('name')
                                .populate('category', 'description')
                                .exec()

        res.json({
            ok: true,
            products
        }) 

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})

app.get('/products/:id', [validAuth], async (req, res) => {
    try {

        const {params} = req
        const {id} = params;
    
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({
            ok: false,
            err: {
                message: 'Product not found'
            }
        })

        res.json({
            ok: true,
            product
        }) 

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})


app.post('/products', validAuth, async (req, res) => {
    try {
        let {body} = req;
        const { 
            name,
            price,
            description,
            avaliable,
            category,
        } = body
        
        let product = new Product({
            name,
            price,
            description,
            avaliable,
            category,
            user: req.user._id
        })


        const productDB = await product.save()

        res.status(201).json({
            ok: true,
            user: productDB
        }) 
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})


app.put('/products/:id', validAuth, async (req, res) => {
    try {
        const {body, params} = req
        const {id} = params;

        _.pick(body,  ['name', 'price', 'description', 'category', 'available'])

        const productDB = await Product.findByIdAndUpdate(id, body, {new: true, runValidators: true, useFindAndModify: false})

        if (!productDB) return res.status(404).json({
            ok: false,
            err: {
                message: 'Product not found'
            }
        })
        
        res.json({
            ok: true,
            product: productDB
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
});

app.delete('/products/:id', validAuth, async (req, res) => {
    try {
        const {id} = req.params;
    
        const deletedProd = await Product.findByIdAndUpdate(
            id, 
            {avaliable: false}, 
            {new: true, useFindAndModify: false}
        )

        if (!deletedProd) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            })
        }

        res.json({
            ok: true,
            user: deletedProd
        });


    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
   
});


app.delete('/products/hard/:id', validAuth, async (req, res) => {
    try {
        const {id} = req.params;
    
        const deletedProd = await Product.findByIdAndDelete(id)

        if (!deletedProd) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            })
        }

        res.json({
            ok: true,
            user: deletedProd
        });


    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
   
});


module.exports = app