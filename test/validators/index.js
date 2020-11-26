'use strict';

const Joi = require('@hapi/joi');
const { expect } = require('@hapi/code');
const { omit } = require('lodash');
const { experiment, test } = exports.lab = require('@hapi/lab').script();

const { VALID_ADDRESS } = require('../../src/validators');

const createAddress = (overrides = {}) => ({
  addressLine1: 'Flat 123',
  addressLine2: '456',
  addressLine3: 'Testing House',
  addressLine4: 'Testing Road',
  town: 'Testington',
  county: 'Testingshire',
  postcode: 'TN1 1TT',
  country: 'United Kingdom',
  uprn: null,
  dataSource: 'wrls',
  ...overrides
});

experiment('validators', () => {
  experiment('VALID_ADDRESS', () => {
    test('can be a string', async () => {
      const { error } = Joi.validate(createAddress(), VALID_ADDRESS);
      expect(error).to.be.null();
    });

    experiment('.addressLine1', () => {
      test('can be named .address1', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine1'),
          address1: 'Flat 123'
        };
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine1');
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('can be null', async () => {
        const { error } = Joi.validate(createAddress({
          addressLine1: null
        }), VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('can be an empty string - converted to null', async () => {
        const { error, value } = Joi.validate(createAddress({
          addressLine1: ''
        }), VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.addressLine1).to.be.null();
      });
    });

    experiment('.addressLine2', () => {
      test('can be named .address2', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine2'),
          address2: 'Flat 123'
        };
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine2');
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('can be null', async () => {
        const { error } = Joi.validate(createAddress({
          addressLine2: null
        }), VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('can be an empty string - converted to null', async () => {
        const { error, value } = Joi.validate(createAddress({
          addressLine2: ''
        }), VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.addressLine2).to.be.null();
      });

      experiment('when addresssLine3 is null', async () => {
        test('cannot be null', async () => {
          const address = createAddress({
            addressLine2: null,
            addressLine3: null
          });

          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.not.be.null();
        });
      });
    });

    experiment('.addressLine3', () => {
      test('can be named .address3', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine3'),
          address3: 'Flat 123'
        };
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine3');
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('can be null', async () => {
        const { error } = Joi.validate(createAddress({
          addressLine3: null
        }), VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('can be an empty string - converted to null', async () => {
        const { error, value } = Joi.validate(createAddress({
          addressLine3: ''
        }), VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.addressLine3).to.be.null();
      });

      experiment('when addressLine2 is null', async () => {
        test('cannot be null', async () => {
          const address = createAddress({
            addressLine2: null,
            addressLine3: null
          });

          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.not.be.null();
        });
      });
    });

    experiment('.addressLine4', () => {
      test('can be named .address4', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine4'),
          address4: 'Flat 123'
        };
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine4');
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('can be null', async () => {
        const { error } = Joi.validate(createAddress({
          addressLine4: null
        }), VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('can be an empty string - converted to null', async () => {
        const { error, value } = Joi.validate(createAddress({
          addressLine4: ''
        }), VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.addressLine4).to.be.null();
      });
    });

    experiment('.town', () => {
      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'town');
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('can be null', async () => {
        const { error } = Joi.validate(createAddress({
          town: null
        }), VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('can be an empty string - converted to null', async () => {
        const { error, value } = Joi.validate(createAddress({
          town: ''
        }), VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.town).to.be.null();
      });

      experiment('when addresssLine4 is null', async () => {
        test('cannot be null', async () => {
          const address = createAddress({
            addressLine4: null,
            town: null
          });

          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.not.be.null();
        });
      });
    });

    experiment('.county', () => {
      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'county');
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('can be null', async () => {
        const { error } = Joi.validate(createAddress({
          county: null
        }), VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('can be an empty string - converted to null', async () => {
        const { error, value } = Joi.validate(createAddress({
          county: ''
        }), VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.county).to.be.null();
      });
    });

    experiment('.country', () => {
      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'country');
        const { error } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('cannot be null', async () => {
        const { error } = Joi.validate(createAddress({
          country: null
        }), VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('cannot be an empty string', async () => {
        const { error } = Joi.validate(createAddress({
          country: ''
        }), VALID_ADDRESS);
        expect(error).to.not.be.null();
      });
    });

    experiment('.postcode', () => {
      experiment('When the country is United Kingdom', () => {
        const country = 'United Kingdom';

        test('cannot be omitted', async () => {
          const address = omit(createAddress({ country }), 'postcode');
          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.not.be.null();
        });

        test('must be a valid postcode', async () => {
          const address = createAddress({ country });
          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.be.null();
        });

        test('cannot be an invalid postcode', async () => {
          const address = createAddress({ country, postcode: 'XXX XXX' });
          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.not.be.null();
        });

        test('cannot be null', async () => {
          const address = createAddress({ country, postcode: null });
          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.not.be.null();
        });
      });

      experiment('for non-UK countries', () => {
        const country = 'Non-UK country';

        test('cannot be omitted', async () => {
          const address = omit(createAddress({ country }), 'postcode');
          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.not.be.null();
        });

        test('can be null', async () => {
          const address = createAddress({ country, postcode: null });
          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.be.null();
        });

        test('can be any string', async () => {
          const address = createAddress({ country, postcode: 'XXX XXX' });
          const { error } = Joi.validate(address, VALID_ADDRESS);
          expect(error).to.be.null();
        });
      });
    });

    experiment('.isTest', () => {
      test('can be omitted - defaults to false', async () => {
        const address = omit(createAddress(), 'isTest');
        const { error, value } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.isTest).to.be.false();
      });

      test('cannot be null', async () => {
        const { error } = Joi.validate(createAddress({
          isTest: null
        }), VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      test('can be a boolean value', async () => {
        const { value } = Joi.validate(createAddress({
          isTest: true
        }), VALID_ADDRESS);
        expect(value.isTest).to.be.true();
      });
    });

    experiment('.uprn', () => {
      test('can be omitted - defaults to null', async () => {
        const address = omit(createAddress(), 'uprn');
        const { error, value } = Joi.validate(address, VALID_ADDRESS);
        expect(error).to.be.null();
        expect(value.uprn).to.be.null();
      });

      test('can be null', async () => {
        const { error } = Joi.validate(createAddress({
          uprn: null
        }), VALID_ADDRESS);
        expect(error).to.be.null();
      });

      test('can be an integer', async () => {
        const { value } = Joi.validate(createAddress({
          uprn: 123
        }), VALID_ADDRESS);
        expect(value.uprn).to.equal(123);
      });

      test('cannot be negative', async () => {
        const { error } = Joi.validate(createAddress({
          uprn: -1
        }), VALID_ADDRESS);
        expect(error).to.not.be.null();
      });
    });

    experiment('.dataSource', () => {
      test('can be omitted - defaults to wrls', async () => {
        const address = omit(createAddress(), 'dataSource');
        const { value } = Joi.validate(address, VALID_ADDRESS);
        expect(value.dataSource).to.equal('wrls');
      });

      test('cannot be null', async () => {
        const { error } = Joi.validate(createAddress({
          dataSource: null
        }), VALID_ADDRESS);
        expect(error).to.not.be.null();
      });

      ['wrls', 'nald', 'ea-address-facade'].forEach(source => {
        test(`can be ${source}`, async () => {
          const { error } = Joi.validate(createAddress({
            dataSource: source
          }), VALID_ADDRESS);
          expect(error).to.be.null();
        });
      });

      test('cannot be an unknown source', async () => {
        const { error } = Joi.validate(createAddress({
          dataSource: 'invalid-source'
        }), VALID_ADDRESS);
        expect(error).to.not.be.null();
      });
    });
  });
});
