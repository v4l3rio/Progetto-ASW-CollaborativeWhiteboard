const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String,
    notifications: [{id: Number, text: String}]
})

const traitSchema = new mongoose.Schema({
    points: [{x: Number, y: Number}],
    color: String
})

const whiteboardSchema = new mongoose.Schema({
    name: String,
    ownerId: Object,
    traits: [traitSchema],
    users: [Object]
})


module.exports.User = mongoose.model('User', userSchema);
module.exports.Trait = mongoose.model('Trait', traitSchema);
module.exports.Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);