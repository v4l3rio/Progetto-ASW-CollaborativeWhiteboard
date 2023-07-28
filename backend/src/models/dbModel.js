const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String,
    notifications: [{id: Number, text: String}]
})

const whiteboardSchema = new mongoose.Schema({
    name: String,
    ownerId: Object,
    traits: Object,
    freeId: Number,
    users: [Object]
})

module.exports.User = mongoose.model('User', userSchema);
module.exports.Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);