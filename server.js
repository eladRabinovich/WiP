'use strict';

/**
 * Prepares and starts the application server.
 * @returns {}
 */
function start() {
    process.env.MONGO_DB = process.env.MONGO_DB || 'wipDb';
    process.env.MONGO_SERVER = process.env.MONGO_SERVER || 'localhost';

    //var restify = require('restify'); will be used in the nearest future!
    var app = require('express')();
    var http = require('http'); // https will be used in the nearest future!
    var bodyParser = require('body-parser');
    var dao = require('./models/dao');                  // Creates the dao object.

    app.use(handleAccess);                              // Handles HTTP access control.
    app.use(bodyParser.json());                         // For parsing application/json
    app.use(bodyParser.urlencoded({extended: true}));   // For parsing application/x-www-form-urlencoded
    app.set('dao', dao);                                // Loads the dao object into the app object.

    require('./routes')(app);                 // Loads the routes into the app object. (requires passport)

    var server = http.createServer(app); // https.createServer(options, app) ??? HTTPS;
    server.listen(8080);

    return {
        server: server,
        app: app
    };

    function handleAccess(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        if ('OPTIONS' == req.method) {
            res.status(200).json({msg:'Ok.'}).send;
        }else {
            next();
        }
    }
}

module.exports = start();
