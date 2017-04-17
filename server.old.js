'use strict';

function buildApp(){

    process.env.MONGO_DB = process.env.MONGO_DB || 'wipDb';
    process.env.MONGO_SERVER = process.env.MONGO_SERVER || 'localhost';

    var express = require('express');
    var app = express();
    var http = require('http'); // var https = require('https');
    // var fs = requires('fs');
    var bodyParser = require('body-parser');

    app.use(handleAccess);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true})); //?
    app.use(express.static(__dirname + '/public')); //?

    //var dao = require('./models/dao');
    //app.set('dao', dao);

    //var passport = require('./middleware/buildPassport')(dao);
    //require('./routes/routes')(app, passport);

    //var options = {
    //    key: fs.readFileSync('./certificates/wip.local.key'),
    //    cert: fs.readFileSync('./certificates/wip.local.crt')
    //};

    app.get('/hello',function(req,res){
       res.send('hello world');
    });

    var server = http.createServer(app); // var server = https.createServer(options, app);
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
            res.status(200).json({msg:'Ok.'});
        }else {
            next();
        }
    }
}

module.exports = buildApp();