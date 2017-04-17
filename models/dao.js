'use strict';

function buildDAO() {
    var winston = require('winston');
    var logger = new winston.Logger();
    logger.add(winston.transports.File, {filename: 'wip.log'}); //Not really in use yet

    var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://' + process.env.MONGO_SERVER + '/' + process.env.MONGO_DB);

    var instance = {};
    instance.SID = '';
    require('./wip')(instance);
    require('./statistics')(instance);

    instance.connection = mongoose.connection;
    instance.connection.on('error', console.error.bind(console, 'connection error:'));
    instance.connection.once('open',loadStatistics); //init point
    instance.connection.once('disconnected', console.log.bind(console, 'Disconnected from mongo database "' + process.env.MONGO_DB + '".\n'));

    function loadStatistics() {

        instance.statistics.find({}, function (error, result) {
            if (error) {
                console.log("failed to find Statistics doc");
            } else if (result.length == 0){
                instance.statistics.create({},function (error, result){
                    if (error || !result){
                        console.log("failed to create Statistics doc");
                    } else {
                        console.log("Statistics doc created successfuly" + '".\n' );
                        instance.SID = result._id;
                        console.log("the Statistics ID is : " + instance.SID);
                    }
                });

            } else if (result.length == 1){
                instance.SID = result[0]._id;
                console.log("the Statistics ID is : " + instance.SID);
            }

            console.log("Connected to mongo database " + process.env.MONGO_DB);
        });
    }

    return instance;
}

module.exports = buildDAO();