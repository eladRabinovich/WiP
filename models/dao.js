'use strict';

function buildDAO() {
    var winston = require('winston');
    var logger = new winston.Logger();
    logger.add(winston.transports.File, {filename: 'wip.log'}); //Not really in use yet

    var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://' + process.env.MONGO_SERVER + '/' + process.env.MONGO_DB);

    var instance = {};
    instance.SID = null; //
    require('./wip')(instance);
    require('./user')(instance);
    require('./category')(instance);

    instance.connection = mongoose.connection;
    instance.connection.on('error', console.error.bind(console, 'connection error:'));
    instance.connection.once('open','Connected to mongo database "' + process.env.MONGO_DB + '".\n');
    instance.connection.once('disconnected', console.log.bind(console, 'Disconnected from mongo database "' + process.env.MONGO_DB + '".\n'));

    function loadStatistics() {

        console.log("Connected to mongo database " + process.env.MONGO_DB);
        var statisticsPromise = instance.statistics.find({}).exec();
        statisticsPromise.then(function (result) {
            if (result.length == 0) {
                var statisticsCreatePromise = instance.statistics.create({});
                statisticsCreatePromise.then(function (result) {
                    console.log("Statistics doc created successfuly" + '".\n');
                    instance.SID = result._id;
                    console.log("the Statistics ID is : " + instance.SID);
                })
                    .catch(function (error) {
                        console.log("Houston we have a problem with SAVE func :" + error);
                    });
            } else if (result.length == 1) {
                instance.SID = result[0]._id;
                console.log("the Statistics ID is : " + instance.SID);
            }
        });
    }

    return instance;
}

module.exports = buildDAO();