var express = require('express');
var router = express.Router();

// Show login
router.get('/', function(req, res, next) {
    res.render('login', {
        redirect: req.query.redirect,
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri
    });
});

// Handle login
router.post('/', function (req, res, next) {
    // Insert your own login mechanism
    if (req.body.email !== 'thom@nightworld.com') {
        res.render('login', {
            redirect: req.body.redirect,
            client_id: req.body.client_id,
            redirect_uri: req.body.redirect_uri
        });
    } else {
        // Successful logins should send the user back to the /oauth/authorise
        // with the client_id and redirect_uri (you could store these in the session)
        return res.redirect((req.body.redirect || '/home') + '?client_id=' +
            req.body.client_id + '&redirect_uri=' + req.body.redirect_uri);
    }
});

module.exports = router;