var crypto = require('crypto');
var error = require('./error');

module.exports = Token;

/**
 * Token generator that will delegate to model or
 * the internal random generator
 *
 * @param  {String}   type     'accessToken' or 'refreshToken'
 * @param  {Function} callback
 */
function Token (config, type, callback) {
  if (config.model.generateToken) {
    config.model.generateToken(type, config.req, function (err, token) {
      if (err) return callback(error('server_error', false, err));
      if (!token) return generateRandomToken(callback);
      callback(false, token);
    });
  } else {
    generateRandomToken(callback);
  }
}

/**
 * Internal random token generator
 *
 * @param  {Function} callback
 */
var generateRandomToken = function (callback) {
  crypto.randomBytes(256, function (ex, buffer) {
    if (ex) return callback(error('server_error'));

    var token = crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');

    callback(false, token);
  });
};
