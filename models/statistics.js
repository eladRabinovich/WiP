'use strict';
//https://github.com/nijikokun/generate-schema automaticSchema
function appendModel(dao) {
    var mongoose = require('mongoose');

    var statisticsSchema = new mongoose.Schema({
        totalByUsername:{
            elad : {type: Number, default: 0},
            sarah : {type: Number, default: 0}
        },
        totalByCategory: {
            weed : {type: Number, default: 0},
            food : {type: Number, default: 0},
            home : {type: Number, default: 0},
            other : {type: Number, default: 0}
        },
        totalCost: {type: Number, default: 0}
    });

    dao.statistics = mongoose.model('statistics', statisticsSchema);

    // statisticsSchema.methods.updateAll = function(category, username, cost, next){
    //     this.find
    // }
}

module.exports = appendModel;
