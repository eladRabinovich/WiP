'use strict';
//https://github.com/nijikokun/generate-schema automaticSchema
function appendModel(dao) {
    var mongoose = require('mongoose');
    var statisticsSchema = new mongoose.Schema({
     totalByUsername: [{type : mongoose.Schema.ObjectId , ref: 'user'}, { type: Number }],
     totalByCategory: [{type : mongoose.Schema.ObjectId , ref: 'category'}, { type: Number }],
     totalCost: {type: Number, default: 0}
     });

    statisticsSchema.methods.getTotal = function () {
        return this.totalCost;
    };

    statisticsSchema.methods.getTotalByUserOld = function (username){
        var totalCost = dao.wip.aggregate([{$match: {username: username}}, {
            $group: {
                _id: null,
                total: {$sum: "$cost"}
            }
        }]);
        return totalCost.total;
    };


    statisticsSchema.methods.getTotalByUser = function (userId){
        var totalCost = dao.wip.aggregate([{$match: {username: userId}}, {
            $group: {
                _id: null,
                total: {$sum: "$cost"}
            }
        }]);
        return totalCost.total;
    };

    statisticsSchema.methods.getTotalByCategory = function (categoryId){
        var totalCost = dao.wip.aggregate([{$match: {username: userId}}, {
            $group: {
                _id: null,
                total: {$sum: "$cost"}
            }
        }]);
        return totalCost.total;
    };


    dao.statistics = mongoose.model('statistics', statisticsSchema);

}

module.exports = appendModel;