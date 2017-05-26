'use strict';

// receipt: { data: Buffer, contentType: String }, https://gist.github.com/aheckmann/2408370
function appendModel(dao) {
    var mongoose = require('mongoose');
    var bcrypt   = require('bcrypt-nodejs');

    var userSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true, unique: true},
        category: [{type : mongoose.Schema.ObjectId, ref: 'category' }],
        accessToken: { type: String },
        date: {type: Date, default: Date.now}
    });

    // generating a hash
    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    userSchema.methods.getId = function() {
        return this._id;
    };


    dao.user = mongoose.model('user', userSchema);

}

module.exports = appendModel;