'use strict'

/**
 * Implementation of deep-map package with reduced feature set to suit our purposes. Iterates over `data` and applies
 * function `fn` to each value. Based on the Charging Module's Object Cleaning Service:
 * https://github.com/DEFRA/sroc-charging-module-api/blob/main/app/services/plugins/object_cleaning.service.js
 *
 * @param {*} data
 * @param {Function} fn
 * @returns {Object|Array}
 */
function deepMap (data, fn) {
  if (data === null) {
    return null
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return _handleArray(data, fn)
    } else {
      return _handleObject(data, fn)
    }
  } else {
    return fn(data)
  }
}

function _handleObject (object, fn) {
  const returnObj = {}

  for (const [key, value] of Object.entries(object)) {
    returnObj[key] = deepMap(value, fn)
  }

  return returnObj
}

function _handleArray (array, fn) {
  const returnArray = []

  for (const value of array) {
    returnArray.push(deepMap(value, fn))
  }

  return returnArray
}

module.exports = deepMap
