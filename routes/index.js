module.exports = function (oauth) {
    var express = require('express');
    var router = express.Router();

    router.get('/:client_id*', function (req, res) {
        // If they aren't logged in, send them to your own login implementation
        if (req.query.code){
            res.render('app', {
                app_name : req.params.client_id
            });
        } else {
            return res.redirect('/oauth/authorise?client_id=' + req.params.client_id +
                '&redirect_uri=' + req.path);
        }
    });

    router.get('/', function (req, res) {
        res.render('index');
    });

    return router;
};
