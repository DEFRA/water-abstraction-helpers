'use strict';

const deepMap = require('deep-map');

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
const transformNull = (data) => {
  return deepMap(data, (val) => {
    // Convert string null to real null
    return (val === 'null')
      ? null
      : val;
  });
};

exports.findCurrent = findCurrent;
exports.transformNull = transformNull;
