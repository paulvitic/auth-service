var pg = require('pg');
var model = module.exports;
var connString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/oauth2' ;
var NodeCache = require( "node-cache" );
var accessTokenCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

/*
 * Required
 */

model.getAccessToken = function (bearerToken, callback) {
   var token = accessTokenCache.get(bearerToken);
    if ( token !== undefined ){
        token.cached = true;
        callback(null, token);
    } else {
        pg.connect(connString, function (err, client, done) {
            if (err) return callback(err);
            client.query('SELECT access_token, client_id, expires, user_id FROM oauth_access_tokens ' +
                'WHERE access_token = $1', [bearerToken], function (err, result) {
                if (err || !result.rowCount) return callback(err);
                // This object will be exposed in req.oauth.token
                // The user_id field will be exposed in req.user (req.user = { id: "..." }) however if
                // an explicit user object is included (token.user, must include id) it will be exposed
                // in req.user instead
                var token = result.rows[0];
                accessTokenCache.set( bearerToken, token);
                callback(null, {
                    accessToken: token.access_token,
                    clientId: token.client_id,
                    expires: token.expires,
                    userId: token.userId
                });
                done();
            });
        });
    }
};

model.getClient = function (clientId, clientSecret, callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) return callback(err);

    client.query('SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE ' +
      'client_id = $1', [clientId], function (err, result) {
      if (err || !result.rowCount) return callback(err);

      var client = result.rows[0];

      if (clientSecret !== null && client.client_secret !== clientSecret) return callback();

      // This object will be exposed in req.oauth.client
      callback(null, {
        clientId: client.client_id,
        clientSecret: client.client_secret,
        redirectUri: client.redirect_uri
      });
      done();
    });
  });
};

model.getRefreshToken = function (bearerToken, callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) return callback(err);
    client.query('SELECT refresh_token, client_id, expires, user_id FROM oauth_refresh_tokens ' +
        'WHERE refresh_token = $1', [bearerToken], function (err, result) {
      // The returned user_id will be exposed in req.user.id
      callback(err, result.rowCount ? result.rows[0] : false);
      done();
    });
  });
};

model.revokeRefreshToken = function (refreshToken, callback) {
  // TODO implement
};

model.grantTypeAllowed = function (clientId, grantType, callback) {
    pg.connect(connString, function (err, client, done) {
        if (err) return callback(err);
        client.query('SELECT * FROM oauth_client_grant_types ' +
            'WHERE client_id = $1 AND grant_type = $2', [clientId, grantType], function (err, result) {
            // The returned user_id will be exposed in req.user.id
            callback(err, result.rowCount ? result.rows[0] : false);
            done();
        });
    });
};

model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) return callback(err);
    client.query('INSERT INTO oauth_access_tokens(access_token, client_id, user_id, expires) ' +
        'VALUES ($1, $2, $3, $4)', [accessToken, clientId, userId.id, expires],
        function (err, result) {
      callback(err);
      done();
    });
  });
};

model.saveRefreshToken = function (refreshToken, clientId, expires, userId, callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) return callback(err);
    client.query('INSERT INTO oauth_refresh_tokens(refresh_token, client_id, user_id, ' +
        'expires) VALUES ($1, $2, $3, $4)', [refreshToken, clientId, userId, expires],
        function (err, result) {
      callback(err);
      done();
    });
  });
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) return callback(err);
    client.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username,
        password], function (err, result) {
      callback(err, result.rowCount ? result.rows[0] : false);
      done();
    });
  });
};


/*
 * Required for authorization_code grant type
 */
model.getAuthCode = function(authCode, callback) {
    pg.connect(connString, function (err, client, done) {
        if (err) return callback(err);
        client.query('SELECT auth_code, client_id, expires, user_id FROM oauth_auth_codes ' +
            'WHERE auth_code = $1', [authCode], function (err, result) {
            if (err || !result.rowCount) return callback(err);
            var code = result.rows[0];
            callback(null, {
                authCode: code.auth_code,
                clientId: code.client_id,
                expires: code.expires,
                userId: code.user_id
            });
            done();
        });
    });
};

model.saveAuthCode = function(authCode, clientId, expires, userId, callback){
    pg.connect(connString, function (err, client, done) {
        if (err) return callback(err);
        client.query('INSERT INTO oauth_auth_codes(auth_code, client_id, user_id, expires) ' +
            'VALUES ($1, $2, $3, $4)', [authCode, clientId, userId, expires],
            function (err, result) {
                callback(err);
                done();
            });
    });
};

/*
 * Required for client_credentials grant type
 */
model.getUserFromClient = function(clientId, clientSecret, callback){
  //TODO implement
};

/*
 * Required for extension grant grant type
 */
model.extendedGrant = function(grantType, req, callback){
  //TODO implement
};
