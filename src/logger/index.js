'use strict'

/**
 * Based on {@link https://github.com/DEFRA/data-returns-pi-frontend/blob/develop/src/lib/logging.js}
 */
const winston = require('winston')
const Joi = require('joi')
const Airbrake = require('./vendor/winston-airbrake').Airbrake
const { get, negate } = require('lodash')

const inParensRegex = /\((.*)\)/
let startFileNameAfter = 'src'

// Setup transports
const defaults = {
  colorize: true,
  silent: false,
  timestamp: true,
  json: false,
  showLevel: true,
  handleExceptions: true,
  humanReadableUnhandledException: true
}

/**
 * Adds Errbit specific data to the error that will be shown in the Errbit UI.
 *
 * @param {Object} error The error that is being logged
 * @param {Object} params Any additional information that will help diagnose issues
 * @returns {Object} The decorated error object
 */
const decorateError = (error, params) => {
  if (error) {
    error.context = { component: getFilename() }

    if (params) {
      error.params = params
    }
  }
  return error
}

/**
 * Given a stack trace line like:
 *
 * at Object.<anonymous> (/file/path/where/something/happened.js:13:1)
 *
 * returns just the file info in the parentheses
 *
 * @param {string} line A line from the stack trace
 * @returns {string} Only the content in the parentheses
 */
const getContentInParentheses = line => {
  if (line.indexOf('(') > -1) {
    return get(inParensRegex.exec(line), '[1]')
  }
  return line
}

/**
 * getContentAfter('/a/b/c/d.js', 'c') ==> '/d.js')
 *
 * @param {string} errorLine A line from a stack trace
 * @param {string} after The token after which the rest of the stack trace line should be returned
 * @returns {string} The end of the stack trace line
 */
const getContentAfter = (errorLine = '', after) => {
  const index = errorLine.indexOf(after)

  return index === -1
    ? errorLine
    : errorLine.substring(index + after.length)
}

const isLineFromThisFile = line => line.indexOf(__filename) > -1

const getStackLines = () => (new Error()).stack.split('\n')

const findCallingFile = stackLines => {
  // Remove first line (Error: 'Message')
  const lines = stackLines.slice(1)

  // Get the first file name that is not this file
  return lines.find(negate(isLineFromThisFile))
}

/**
 * Gets the filename of the function that has called into this module.
 *
 * @returns {string} The filename of the file that contains the calling function
 */
const getFilename = () => {
  const stackLines = getStackLines()
  const callingFile = findCallingFile(stackLines)
  const fileAndLines = getContentInParentheses(callingFile)

  return startFileNameAfter
    ? getContentAfter(fileAndLines, startFileNameAfter)
    : fileAndLines
}

/**
 * Creates a proxy onto logger.error that adds additional behaviour to
 * augment the error object with Errbit specific properties.
 */
const proxyLoggerError = logger => {
  const errorProxy = logger.error
  logger.error = (msg, error, params = {}) => {
    const parsedError = parseError(error)
    const err = decorateError(parsedError, params)
    errorProxy(msg, err)
  }
}

const parseError = (error) => {
  let parsedError = {}

  if (typeof error === 'string') {
    parsedError.stack = error
  } else {
    parsedError = error
  }

  return parsedError
}

const initAirbrakeLogger = (logger, options) => {
  if (options.airbrakeKey && options.airbrakeHost) {
    const airbrakeOptions = {
      apiKey: options.airbrakeKey,
      host: options.airbrakeHost,
      projectId: true,
      level: options.airbrakeLevel,
      env: process.env.NODE_ENV,
      proxy: process.env.PROXY
    }
    logger.add(Airbrake, airbrakeOptions)

    proxyLoggerError(logger)
  }
}

const createLogger = (config = {}) => {
  // Validate the provided config object
  const logger = new winston.Logger()

  const schema = Joi.object({
    level: Joi.string().allow('debug', 'verbose', 'info', 'warn', 'error').default('info'),
    airbrakeKey: Joi.string().allow(''),
    airbrakeHost: Joi.string().allow(''),
    airbrakeLevel: Joi.string().allow('debug', 'verbose', 'info', 'warn', 'error').default('error'),
    startFileNameAfter: Joi.string().default('src')
  })

  const { error, value: options } = schema.validate(config)

  if (error) {
    throw new Error('Invalid log configuration', error)
  }

  startFileNameAfter = options.startFileNameAfter

  // Default console transport
  logger.add(winston.transports.Console, { ...defaults, level: options.level })

  initAirbrakeLogger(logger, options)

  return logger
}

module.exports.createLogger = createLogger
module.exports.decorateError = decorateError
