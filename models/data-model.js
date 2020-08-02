const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, 
    bestKnownFor: {
        type: String
    }, 
    union: {
        type: String
    }, 
    daytime: {
        type: String, 
    }, 
    ageMin: {
        type: Number
    }, 
    ageMax: {
        type: Number
    },
    heightFt: {
        type: Number
    }, 
    heightIn: {
        type: Number
    }, 
    hairColor: {
        type: String
    }, 
    shoe: {
        type: Number
    }, 
    size: {
        type: String
    }, 
    skills: {
        type: Array
    }, 
    phone: {
        type: String
    }, 
    email: {
        type: String
    }, 
    imageUrl: {
        type: String
    }
});

const Data = mongoose.model('Data', DataSchema);

module.exports = Data