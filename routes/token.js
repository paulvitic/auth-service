module.exports = function (oauth) {
    var express = require('express');
    var router = express.Router();

    // routing
    router.all('/', oauth.grant());

    return router;
};