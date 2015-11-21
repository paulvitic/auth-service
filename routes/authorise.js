module.exports = function (oauth) {
    var express = require('express');
    var router = express.Router();

    // Show them the "do you authorise xyz app to access your content?" page
    router.get('/', function (req, res, next) {
        if (!req.session.user) {
            // If they aren't logged in, send them to your own login implementation
            return res.redirect('/login?redirect=' + req.path + '&client_id=' +
                req.query.client_id + '&redirect_uri=' + req.query.redirect_uri);
        }

        res.render('authorise', {
            client_id: req.query.client_id,
            redirect_uri: req.query.redirect_uri
        });
    });

    // Handle authorise
    router.post('/', function (req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login?client_id=' + req.query.client_id +
                '&redirect_uri=' + req.query.redirect_uri);
        }

        next();
    }, oauth.authCodeGrant(function (req, next) {
        // The first param should to indicate an error
        // The second param should a bool to indicate if the user did authorise the app
        // The third param should for the user/uid (only used for passing to saveAuthCode)
        next(null, req.body.allow === 'yes', req.session.user.id, req.session.user);
    }));

    return router;
};