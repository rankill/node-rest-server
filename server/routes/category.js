const express = require('express');

const { validAuth, isAdminRole }  = require('../middlewares/auth');

const app = express();

const  Category = require('../models/category')

const _ = require('underscore');


app.get('/categories', [validAuth],  async (req, res) => {
    try {


        const categories = await Category
                                .find({status: true})
                                .sort('description')
                                .populate('user', 'name email')
                                .exec()

        res.json({
            ok: true,
            categories
        }) 

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})

app.get('/categories/:id', [validAuth], async (req, res) => {
    try {

        const {params} = req
        const {id} = params;
    
        const category = await Category.findById(id);

        if (!category) return res.status(404).json({
            ok: false,
            err: {
                message: 'Category not found'
            }
        })

        res.json({
            ok: true,
            category
        }) 

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})


app.post('/categories', async (req, res) => {
    try {
        let {body} = req;
        const { description, user } = body
        let category = new Category({
            description,
            user
        })


        const categoryDB = await category.save()

        res.json({
            ok: true,
            user: categoryDB
        }) 
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})


app.put('/categories/:id', validAuth, async (req, res) => {
    try {
        const {body, params} = req
        const {id} = params;

        _.pick(body,  ['description'])

        const categoryDB = await Category.findByIdAndUpdate(id, body, {new: true, runValidators: true, useFindAndModify: false})

        if (!categoryDB) return res.status(404).json({
            ok: false,
            err: {
                message: 'Category not found'
            }
        })
        
        res.json({
            ok: true,
            category: categoryDB
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
});

app.delete('/categories/:id', [validAuth, isAdminRole], async (req, res) => {
    try {
        const {id} = req.params;
        const q = {
            status: false
        }
    
        const deletedCat = await Category.findByIdAndUpdate(id, q, {new: true, useFindAndModify: false})

        if (!deletedCat) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            user: deletedCat
        });


    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
   
});


app.delete('/categories/hard/:id', [validAuth, isAdminRole], async (req, res) => {
    try {
        const {id} = req.params;
    
        const deletedCat = await Category.findByIdAndDelete(id)

        if (!deletedCat) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            user: deletedCat
        });


    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
   
});


module.exports = app