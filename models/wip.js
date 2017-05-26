'use strict';

function appendModel(dao) {
    var mongoose = require('mongoose');

    var wipSchema = new mongoose.Schema({
        usernameID:{type: mongoose.Schema.ObjectId, required: true},
        categoryID: {type: mongoose.Schema.ObjectId ,required: true},
        cost: {type: Number, required: true},
        // receipt: { data: Buffer, contentType: String }, https://gist.github.com/aheckmann/2408370
        date: {type: Date, default: Date.now}
    });

    dao.wip = mongoose.model('wip', wipSchema);
}

module.exports = appendModel;