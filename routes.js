'use strict';

function routes(app){
    var dao = app.get('dao');
    var apiController = require('./controllers/apiController')(dao);
    app.use('/api', apiController);
}

module.exports = routes;