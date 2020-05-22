'use strict';

const deepMap = require('deep-map');
const { isString, trim } = require('lodash');

exports.dates = require('./dates');
exports.formatting = require('./formatting');

const isCurrentVersion = version => version.STATUS === 'CURR';

/**
 * From an array of version, finds a versiont that has a status of CURR
 * @param {Array} versions
 * @return {Object | undefined} The current version or undeined if not current version
 */
const findCurrent = (versions = []) => versions.find(isCurrentVersion);

/**
 * Transform string 'null' values to real null
 * @param {Object} data
 * @return {Object}
 */
const transformNull = data => deepMap(data, stringNullToNull);

const stringNullToNull = val => val === 'null' ? null : val;

const trimValues = data => {
  return deepMap(data, val => isString(val) ? trim(val) : val);
};

exports.findCurrent = findCurrent;
exports.stringNullToNull = stringNullToNull;
exports.transformNull = transformNull;
exports.trimValues = trimValues;
