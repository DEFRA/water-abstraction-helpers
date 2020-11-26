'use strict';

const { expect } = require('@hapi/code');
const { over } = require('lodash');
const { omit } = require('lodash');
const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();

const Joi = require('@hapi/joi').extend(
  require('../../src/validators/extensions')
);


experiment('validators/extensions.js', () => {
  experiment('.convertEmptyStringToNull', () => {

    let schema;

    beforeEach(async () => {
      schema = Joi.nullableString();
    });

    test('converts an empty string to null', async () => {
      const { error, value } = Joi.validate('', schema);
      expect(value).to.be.null();
    });

    test('converts a padded empty string to null', async () => {
      const { error, value } = Joi.validate('  ', schema);
      expect(value).to.be.null();
    });

    test('leaves other strings unchanged', async () => {
      const { error, value } = Joi.validate('Hello', schema);
      expect(value).to.equal('Hello');
    });

    test('accepts null', async () => {
      const { error, value } = Joi.validate(null, schema);
      expect(value).to.be.null();
    });


  });
});
