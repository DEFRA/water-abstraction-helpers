'use strict'

const EventEmitter = require('events')
const emitter = new EventEmitter()

const rp = require('request-promise-native').defaults({
  proxy: null,
  strictSSL: false
})

const ON_PRE_REQUEST = 'onPreRequest'

/**
 * Makes the request using request-promise-native
 *
 * Before the request is made an event is published using the
 * key 'onPreRequest' which gives listeners a hook to make
 * last minute modifications to the options object
 *
 * @param {Object} options Object representing the request as defined by request-promise
 */
const request = options => {
  emitter.emit(ON_PRE_REQUEST, options)
  return rp(options)
}

/**
 * Allows the registration of an event handler that is
 * published just before the request is made.
 *
 * @param {Function} handler Function that will receieve the options object
 */
const onPreRequest = handler => emitter.on(ON_PRE_REQUEST, handler)

/**
 * Allows the listeners to onPreRequest to be removed to prevent
 * excess registrations.
 */
const removePreRequestListener = () => emitter.removeAllListeners(ON_PRE_REQUEST)

exports.request = request
exports.onPreRequest = onPreRequest
exports.removePreRequestListener = removePreRequestListener
