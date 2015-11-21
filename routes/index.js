module.exports = function (oauth) {
    var express = require('express');
    var router = express.Router();

    var model = require('../service/model');

    // routing
    router.get('/:client_id/secret*', oauth.authorise(), function (req, res) {
        // Will require a valid access_token
        res.send('Secret area');
    });

    router.get('/:client_id*', function (req, res) {
        //req.session.user = 'paulv';
        //if (!req.session.user){}
        // validation if client is available
        model.getClient(req.params.client_id, null, function(error, client){
            res.render('app', {
                app_name: req.params.client_id,
                app_managed : client
            });
        });
    });

    router.get('/', function (req, res) {
        //req.session.user = 'paulv';
        if (!req.session.user){
            res.render('index');
        }
    });

    return router;
};
