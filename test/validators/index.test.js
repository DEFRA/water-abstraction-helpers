'use strict'

const { expect } = require('@hapi/code')
const { omit } = require('lodash')
const { experiment, test } = exports.lab = require('@hapi/lab').script()

const { VALID_ADDRESS } = require('../../src/validators')

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
})

experiment('validators', () => {
  experiment('VALID_ADDRESS', () => {
    test('can be a string', async () => {
      const { error } = VALID_ADDRESS.validate(createAddress())
      expect(error).to.be.undefined()
    })

    experiment('.addressLine1', () => {
      test('can be named .address1', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine1'),
          address1: 'Flat 123'
        }
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.be.undefined()
      })

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine1')
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.not.be.undefined()
      })

      test('can be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          addressLine1: null
        }))
        expect(error).to.be.undefined()
      })

      test('can be an empty string - converted to null', async () => {
        const { error, value } = VALID_ADDRESS.validate(createAddress({
          addressLine1: ''
        }))
        expect(error).to.be.undefined()
        expect(value.addressLine1).to.be.null()
      })
    })

    experiment('.addressLine2', () => {
      test('can be named .address2', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine2'),
          address2: 'Flat 123'
        }
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.be.undefined()
      })

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine2')
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.not.be.null()
      })

      test('can be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          addressLine2: null
        }))
        expect(error).to.be.undefined()
      })

      test('can be an empty string - converted to null', async () => {
        const { error, value } = VALID_ADDRESS.validate(createAddress({
          addressLine2: ''
        }))
        expect(error).to.be.undefined()
        expect(value.addressLine2).to.be.null()
      })

      experiment('when addresssLine3 is null', () => {
        test('cannot be null', async () => {
          const address = createAddress({
            addressLine2: null,
            addressLine3: null
          })

          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.not.be.null()
        })
      })
    })

    experiment('.addressLine3', () => {
      test('can be named .address3', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine3'),
          address3: 'Flat 123'
        }
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.be.undefined()
      })

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine3')
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.not.be.null()
      })

      test('can be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          addressLine3: null
        }))
        expect(error).to.be.undefined()
      })

      test('can be an empty string - converted to null', async () => {
        const { error, value } = VALID_ADDRESS.validate(createAddress({
          addressLine3: ''
        }))
        expect(error).to.be.undefined()
        expect(value.addressLine3).to.be.null()
      })

      experiment('when addressLine2 is null', () => {
        test('cannot be null', async () => {
          const address = createAddress({
            addressLine2: null,
            addressLine3: null
          })

          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.not.be.null()
        })
      })
    })

    experiment('.addressLine4', () => {
      test('can be named .address4', async () => {
        const address = {
          ...omit(createAddress(), 'addressLine4'),
          address4: 'Flat 123'
        }
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.be.undefined()
      })

      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'addressLine4')
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.not.be.null()
      })

      test('can be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          addressLine4: null
        }))
        expect(error).to.be.undefined()
      })

      test('can be an empty string - converted to null', async () => {
        const { error, value } = VALID_ADDRESS.validate(createAddress({
          addressLine4: ''
        }))
        expect(error).to.be.undefined()
        expect(value.addressLine4).to.be.null()
      })
    })

    experiment('.town', () => {
      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'town')
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.not.be.null()
      })

      test('can be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          town: null
        }))
        expect(error).to.be.undefined()
      })

      test('can be an empty string - converted to null', async () => {
        const { error, value } = VALID_ADDRESS.validate(createAddress({
          town: ''
        }))
        expect(error).to.be.undefined()
        expect(value.town).to.be.null()
      })

      experiment('when addresssLine4 is null', () => {
        test('cannot be null', async () => {
          const address = createAddress({
            addressLine4: null,
            town: null
          })

          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.not.be.null()
        })
      })
    })

    experiment('.county', () => {
      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'county')
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.not.be.null()
      })

      test('can be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          county: null
        }))
        expect(error).to.be.undefined()
      })

      test('can be an empty string - converted to null', async () => {
        const { error, value } = VALID_ADDRESS.validate(createAddress({
          county: ''
        }))
        expect(error).to.be.undefined()
        expect(value.county).to.be.null()
      })
    })

    experiment('.country', () => {
      test('cannot be omitted', async () => {
        const address = omit(createAddress(), 'country')
        const { error } = VALID_ADDRESS.validate(address)
        expect(error).to.not.be.null()
      })

      test('cannot be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          country: null
        }))
        expect(error).to.not.be.null()
      })

      test('cannot be an empty string', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          country: ''
        }))
        expect(error).to.not.be.null()
      })
    })

    experiment('.postcode', () => {
      experiment('When the country is United Kingdom', () => {
        const country = 'United Kingdom'

        test('cannot be omitted', async () => {
          const address = omit(createAddress({ country }), 'postcode')
          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.not.be.null()
        })

        test('must be a valid postcode', async () => {
          const address = createAddress({ country })
          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.be.undefined()
        })

        test('cannot be an invalid postcode', async () => {
          const address = createAddress({ country, postcode: 'XXX XXX' })
          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.not.be.null()
        })

        test('cannot be null', async () => {
          const address = createAddress({ country, postcode: null })
          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.not.be.null()
        })
      })

      experiment('for non-UK countries', () => {
        const country = 'Non-UK country'

        test('cannot be omitted', async () => {
          const address = omit(createAddress({ country }), 'postcode')
          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.not.be.null()
        })

        test('can be null', async () => {
          const address = createAddress({ country, postcode: null })
          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.be.undefined()
        })

        test('can be any string', async () => {
          const address = createAddress({ country, postcode: 'XXX XXX' })
          const { error } = VALID_ADDRESS.validate(address)
          expect(error).to.be.undefined()
        })
      })
    })

    experiment('.isTest', () => {
      test('can be omitted - defaults to false', async () => {
        const address = omit(createAddress(), 'isTest')
        const { error, value } = VALID_ADDRESS.validate(address)
        expect(error).to.be.undefined()
        expect(value.isTest).to.be.false()
      })

      test('cannot be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          isTest: null
        }))
        expect(error).to.not.be.null()
      })

      test('can be a boolean value', async () => {
        const { value } = VALID_ADDRESS.validate(createAddress({
          isTest: true
        }))
        expect(value.isTest).to.be.true()
      })
    })

    experiment('.uprn', () => {
      test('can be omitted - defaults to null', async () => {
        const address = omit(createAddress(), 'uprn')
        const { error, value } = VALID_ADDRESS.validate(address)
        expect(error).to.be.undefined()
        expect(value.uprn).to.be.null()
      })

      test('can be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          uprn: null
        }))
        expect(error).to.be.undefined()
      })

      test('can be an integer', async () => {
        const { value } = VALID_ADDRESS.validate(createAddress({
          uprn: 123
        }))
        expect(value.uprn).to.equal(123)
      })

      test('cannot be negative', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          uprn: -1
        }))
        expect(error).to.not.be.null()
      })
    })

    experiment('.dataSource', () => {
      test('can be omitted - defaults to wrls', async () => {
        const address = omit(createAddress(), 'dataSource')
        const { value } = VALID_ADDRESS.validate(address)
        expect(value.dataSource).to.equal('wrls')
      })

      test('cannot be null', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          dataSource: null
        }))
        expect(error).to.not.be.null()
      });

      ['wrls', 'nald', 'ea-address-facade'].forEach(source => {
        test(`can be ${source}`, async () => {
          const { error } = VALID_ADDRESS.validate(createAddress({
            dataSource: source
          }))
          expect(error).to.be.undefined()
        })
      })

      test('cannot be an unknown source', async () => {
        const { error } = VALID_ADDRESS.validate(createAddress({
          dataSource: 'invalid-source'
        }))
        expect(error).to.not.be.null()
      })
    })
  })
})
