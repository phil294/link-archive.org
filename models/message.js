const mongoose = require('mongoose');

module.exports = mongoose.model('Message', new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    date: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
}));

