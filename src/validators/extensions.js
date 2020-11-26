'use strict';

const { isString } = require('lodash');

const extension = joi => ({
   base: joi.string().allow(null),
   name: 'nullableString',
   coerce: function (value, state, options) {
      if (isString(value) && value.trim() === '') {
         return null;
      }
      return value;
   }
});

module.exports = extension;
