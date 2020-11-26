'use strict';

const { expect } = require('@hapi/code');
const { experiment, test, beforeEach } = exports.lab = require('@hapi/lab').script();

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
      const { value } = Joi.validate('', schema);
      expect(value).to.be.null();
    });

    test('converts a padded empty string to null', async () => {
      const { value } = Joi.validate('  ', schema);
      expect(value).to.be.null();
    });

    test('leaves other strings unchanged', async () => {
      const { value } = Joi.validate('Hello', schema);
      expect(value).to.equal('Hello');
    });

    test('accepts null', async () => {
      const { value } = Joi.validate(null, schema);
      expect(value).to.be.null();
    });
  });
});
