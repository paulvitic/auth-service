var express = require('express');
var router = express.Router();
var model = require('../service/model');

// Show login
router.get('/', function(req, res, next) {
    res.render('login', {
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri
    });
});

// Handle login
router.post('/', function (req, res, next) {
    model.getUser(req.body.username, req.body.password, function(error, user){
        req.session.user = req.body.clientId;
        return res.redirect('/oauth/authorise?client_id=' +
            req.body.clientId + '&redirect_uri=' + req.body.redirectUri);

    });
});

module.exports = router;