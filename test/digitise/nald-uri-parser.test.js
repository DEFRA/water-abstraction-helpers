'use strict';

require('dotenv').config();

const {
  experiment,
  test
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const digitise = require('../../src/digitise');

experiment('digitise/index.js', () => {
  experiment('.parseNaldDataURI', () => {
    test('when there are no params', async () => {
      expect(() => digitise.parseNaldDataURI()).to.throw('Error parsing NALD data URI undefined');
    });
    test('when there are invalid params', async () => {
      const input = 'I will fail';
      expect(() => digitise.parseNaldDataURI(input)).to.throw(`Error parsing NALD data URI ${input}`);
    });
    test('when the entity is missing', async () => {
      const entity = '';
      const regionId = '';
      const id = '';
      const input = `nald://${entity}/${regionId}/${id}`;
      expect(() => digitise.parseNaldDataURI(input)).to.throw('Error parsing NALD data URI nald:////');
    });
    test('when there are valid entity but regionId and is is Nan', async () => {
      const entity = 'valid';
      const regionId = '';
      const id = '';
      const input = `nald://${entity}/${regionId}/${id}`;
      expect(() => digitise.parseNaldDataURI(input)).to.throw(`Error parsing NALD data URI nald://${entity}//`);
    });
    test('when there is a valid NALD', async () => {
      const entity = 'valid';
      const regionId = 1;
      const id = 2;
      const input = `nald://${entity}/${regionId}/${id}`;
      expect(digitise.parseNaldDataURI(input)).to.equal({ entity, regionId, id });
    });
  });
});
