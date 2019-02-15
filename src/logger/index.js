'use strict';

/**
 * Based on {@link https://github.com/DEFRA/data-returns-pi-frontend/blob/develop/src/lib/logging.js}
 */
const winston = require('winston');
const Joi = require('joi');
const Airbrake = require('./vendor/winston-airbrake').Airbrake;

const logger = new (winston.Logger)();

// Setup transports
const defaults = {
  colorize: true,
  silent: false,
  timestamp: true,
  json: false,
  showLevel: true,
  handleExceptions: true,
  humanReadableUnhandledException: true
};

const createErrorContext = (fileName, action) => {
  if (fileName || action) {
    return {
      component: fileName,
      action
    };
  }
};

/**
 * Adds Errbit specific data to the error that will be shown in the Errbit UI.
 *
 * @param {Object} error The error that is being logged
 * @param {string} fileName The file that is logging the error
 * @param {Object} params Any additional information that will help diagnose issues
 * @param {string} action The name of the function where the error has occured
 * @returns {Object} The decorated error object
 */
const decorateError = (error, fileName, params, action) => {
  if (error) {
    error.context = createErrorContext(fileName, action);

    if (params) {
      error.params = params;
    }
  }
  return error;
};

const init = (config = {}) => {
  // Validate the provided config object
  const schema = {
    level: Joi.string().allow('debug', 'verbose', 'info', 'warn', 'error').default('info'),
    airbrakeKey: Joi.string().allow(''),
    airbrakeHost: Joi.string().allow(''),
    airbrakeLevel: Joi.string().allow('debug', 'verbose', 'info', 'warn', 'error').default('error')
  };

  const { error, value: options } = Joi.validate(config, schema);

  if (error) {
    throw new Error('Invalid log configuration', error);
  }

  // Default console transport
  logger.add(winston.transports.Console, { ...defaults, level: options.level });

  // Optional Airbrake transport
  if (options.airbrakeKey && options.airbrakeHost) {
    const airbrakeOptions = {
      apiKey: options.airbrakeKey,
      host: options.airbrakeHost,
      projectId: true,
      level: options.airbrakeLevel,
      env: process.env.NODE_ENV,
      proxy: process.env.PROXY
    };
    logger.add(Airbrake, airbrakeOptions);
  }
};

module.exports = logger;
module.exports.init = init;
module.exports.decorateError = decorateError;
