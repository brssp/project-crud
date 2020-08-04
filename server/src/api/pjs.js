const express = require('express')
const monk = require('monk')
const Joi = require('@hapi/joi')

const db = monk(process.env.MONGO_URI)
const pjs = db.get('projects')

const schema = Joi.object({
    name: Joi.string().trim().required(),
    desc: Joi.string().trim().required(),
    completed: Joi.boolean().required()
})

const router = express.Router()


// READ ALL
router.get('/', async (req, res, next) => {
    try {
        const items = await pjs.find({})
        res.json(items)
    } catch (error) {
        next(error)
    }
})

//READ ONE 
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await pjs.findOne({
            _id: id
        })
        if (!item) return next()
        return res.json(item)
    } catch (error) {
        next(error)
    }
})

//CREATE ONE 
router.post('/', async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body)
        const inserted = await pjs.insert(value)
        res.json(inserted)
    } catch (error) {
        next(error)
    }
})

//UPDATE ONE 
router.put('/:id', async (req,res, next) => {
    try {
        const { id } = req.params
        const value = await schema.validateAsync(req.body)
        const item = await pjs.findOne({
            _id: id
        })
        if (!item) return next()
        const updated = await pjs.update({
            _id: id
        }, {
            $set: value
        })
        res.json(updated)
    } catch (error) {
        next(error)
    }
})

//DELETE ONE
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        await pjs.remove({
            _id: id
        })
        res.json({
            message: 'Deleted'
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router