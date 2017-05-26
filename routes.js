'use strict';

function routes(app, passport){
    var dao = app.get('dao');

    var wipController = require('./controllers/wipController')(dao, passport);
    var loginController = require('./controllers/loginController')(dao, passport);

    app.use('/wip', wipController);
    app.use('/login', loginController);
}

module.exports = routes;