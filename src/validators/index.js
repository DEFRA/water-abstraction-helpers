'use strict';

/**
 * @module validators/index.js
 * Provides some common validators used throughout the services
 */

const Joi = require('@hapi/joi').extend(
  require('./extensions')
);

const UPRN = Joi.number().integer().min(0).default(null).allow(null);
const REQUIRED_STRING = Joi.string().trim().required();
const NULLABLE_STRING = Joi.nullableString().trim().required();

const DATA_SOURCE = Joi.string().valid('wrls', 'nald', 'ea-address-facade').optional().default('wrls');
const TEST_FLAG = Joi.boolean().optional().default(false);

const mandatoryPostcodeCountries = [
  'united kingdom',
  'england',
  'wales',
  'scotland',
  'northern ireland',
  'uk'
];

// https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation
const postcodeRegex = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;

const VALID_ADDRESS = Joi.object({
  addressLine1: NULLABLE_STRING,
  addressLine2: NULLABLE_STRING,
  addressLine3: Joi.when('addressLine2', { is: null, then: REQUIRED_STRING, otherwise: NULLABLE_STRING }),
  addressLine4: NULLABLE_STRING,
  town: Joi.when('addressLine4', { is: null, then: REQUIRED_STRING, otherwise: NULLABLE_STRING }),
  county: NULLABLE_STRING,
  country: Joi.string().trim().replace(/\./g, '').required(),
  postcode: Joi.when('country', {
    is: Joi.string().lowercase().replace(/\./g, '').valid(mandatoryPostcodeCountries),
    then: Joi.string().required()
      // uppercase and remove any spaces (BS1 1SB -> BS11SB)
      .uppercase().replace(/ /g, '')
      // then ensure the space is before the inward code (BS11SB -> BS1 1SB)
      .replace(/(.{3})$/, ' $1').regex(postcodeRegex),
    otherwise: NULLABLE_STRING
  }),
  isTest: TEST_FLAG,
  uprn: UPRN,
  dataSource: DATA_SOURCE
})
  .rename('address1', 'addressLine1', { ignoreUndefined: true })
  .rename('address2', 'addressLine2', { ignoreUndefined: true })
  .rename('address3', 'addressLine3', { ignoreUndefined: true })
  .rename('address4', 'addressLine4', { ignoreUndefined: true })
  .or('addressLine2', 'addressLine3');

exports.VALID_ADDRESS = VALID_ADDRESS;
