/**
 * Original source:  https://github.com/dstevensio/winston-airbrake/blob/master/lib/winston-airbrake.js
 * Modified to use newer airbrake-js library and to add support for proxy servers.
 */

// winston-airbrake.js: Transport for outputting logs to Airbrake
var request = require('request');
var util = require('util');
var winston = require('winston');
var AirbrakeClient = require('airbrake-js');
const { isError } = require('lodash');

/**
 * Creates configuration object for Airbrake client
 * @param  {Object} options - options object used in creating the transport
 * @return {Object}         - options object expected by Airbrake
 */
const createClientOptions = (options) => {
  const clientOptions = {
    projectId: options.projectId,
    projectKey: options.apiKey,
    host: options.host
  };

  if (options.proxy) {
    clientOptions.request = request.defaults({ proxy: options.proxy });
  }

  return clientOptions;
};

const Airbrake = exports.Airbrake = winston.transports.Airbrake = function (options) {
  this.name = 'airbrake';
  this.level = options.level || 'info';
  this.silent = options.silent || false;
  this.handleExceptions = options.handleExceptions || false;

  if (!options.apiKey) {
    throw new Error('You must specify an airbrake API Key to use winston-airbrake');
  }

  this.airbrakeClient = new AirbrakeClient(createClientOptions(options));
};

util.inherits(Airbrake, winston.Transport);

/**
 * Creates notice in a format expected by Airbrake client
 * @param  {String} level - Error level, error, warning etc
 * @param  {String} msg   - Descripting error text
 * @param  {Object} meta  - optional additional metadata
 * @return {Object}       notice for sending to Airbrake API
 */
const createNotice = (level, message, meta) => {
  const err = isError(meta) ? meta : new Error(message);
  err.type = level;
  const notice = {
    error: err
  };
  if (meta) {
    notice.params = meta.params || {};
    notice.context = meta.context;
  }

  if (isError(meta)) {
    notice.params.message = message;
  }
  return notice;
};

Airbrake.prototype.log = function (level, msg, meta = {}, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  const notice = createNotice(level, msg, meta);

  this.airbrakeClient.notify(notice, function (err, url) {
    if (err) {
      return callback(err, false);
    }
    return callback(null, { 'url': url });
  });
};

exports.createNotice = createNotice;
exports.createClientOptions = createClientOptions;
