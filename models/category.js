'use strict';

// receipt: { data: Buffer, contentType: String }, https://gist.github.com/aheckmann/2408370
function appendModel(dao) {
    var mongoose = require('mongoose');

    var categorySchema = new mongoose.Schema({
        categoryName: {type: String, required: true, unique: true}
    });

    dao.category = mongoose.model('category', categorySchema);

}

module.exports = appendModel;