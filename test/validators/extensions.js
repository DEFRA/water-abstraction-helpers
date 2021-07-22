'use strict';

const { expect } = require('@hapi/code');
const { experiment, test, beforeEach } = exports.lab = require('@hapi/lab').script();

const Joi = require('joi').extend(
  require('../../src/validators/extensions')
);

experiment('validators/extensions.js', () => {
  experiment('.convertEmptyStringToNull', () => {
    let schema;

    beforeEach(async () => {
      schema = Joi.nullableString();
    });

    test('converts an empty string to null', async () => {
      const { value } = schema.validate('');
      expect(value).to.be.null();
    });

    test('converts a padded empty string to null', async () => {
      const { value } = schema.validate('  ');
      expect(value).to.be.null();
    });

    test('leaves other strings unchanged', async () => {
      const { value } = schema.validate('Hello');
      expect(value).to.equal('Hello');
    });

    test('accepts null', async () => {
      const { value } = schema.validate(null);
      expect(value).to.be.null();
    });
  });
});
