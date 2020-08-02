const router = require('express').Router()
let Data = require('../models/data-model')

router.route('/').get((req, res) => {
    Data.find().then(data => res.json(data)).catch(err => res.status(400).json(err))
})

router.route('/add').post((req, res) => {
    const name = req.body.name
    const bestKnownFor = req.body.bestKnownFor
    const union = req.body.union
    const daytime = req.body.daytime
    const ageMin = req.body.ageMin
    const ageMax = req.body.ageMax
    const heightFt = req.body.heightFt
    const heightIn = req.body.heightIn
    const hairColor = req.body.hairColor
    const shoe = req.body.shoe
    const size = req.body.size
    const skills = req.body.skills
    const phone = req.body.phone
    const email = req.body.email
    const imageUrl = req.body.imageUrl

    const newModel = new Data({name, bestKnownFor, union, daytime, ageMin, ageMax, heightFt, heightIn, hairColor, shoe, size, skills, phone, email, imageUrl})

    newModel.save().then(() => res.json(newModel)).catch(err => res.status(400).json(err))
})

router.route('/:id').delete((req, res) => {
    Data.findByIdAndDelete(req.params.id).then(() => res.json('Model deleted.')).catch(err => res.status(400).json(err))
})

module.exports = router