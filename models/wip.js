'use strict';

function appendModel(dao) {
    var mongoose = require('mongoose');
    var userName = ['elad', 'sarah'];
    var category =['weed', 'food', 'home', 'other'];

    var wipSchema = new mongoose.Schema({
        username:{type: String, required: true, enum: userName},
        category: {type: String,required: true, enum: category},
        cost: {type: Number, required: true},
        // receipt: { data: Buffer, contentType: String }, https://gist.github.com/aheckmann/2408370
        date: {type: Date, default: Date.now}
    });

    dao.wip = mongoose.model('wip', wipSchema);
}

module.exports = appendModel;