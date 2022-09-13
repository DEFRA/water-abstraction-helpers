'use strict'

const {
  experiment,
  test
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

// Thing to test
const digitise = require('../../src/digitise')

experiment('digitise/index.js', () => {
  experiment('transformNulls', () => {
    experiment('when a string \'null\' is provided', () => {
      test('transforms it to `null`', () => {
        const result = digitise.transformNulls('null')
        expect(result).to.be.null()
      })
    })

    experiment('when an empty string is provided', () => {
      test('transforms it to `null`', () => {
        const result = digitise.transformNulls('')
        expect(result).to.be.null()
      })
    })

    experiment('when `null` is provided', () => {
      test('leaves it as `null`', () => {
        const result = digitise.transformNulls(null)
        expect(result).to.be.null()
      })
    })

    experiment('when a regular string is provided', () => {
      test('leaves it as-is', () => {
        const result = digitise.transformNulls('NOT_NULL')
        expect(result).to.equal('NOT_NULL')
      })
    })

    experiment('when a number is provided', () => {
      test('leaves it as-is', () => {
        const result = digitise.transformNulls(123)
        expect(result).to.equal(123)
      })
    })

    experiment('when a mixed array is provided', () => {
      test('applies the correct transformation to each item', () => {
        const result = digitise.transformNulls(['null', null, '', 'NOT_NULL'])
        expect(result).to.equal([null, null, null, 'NOT_NULL'])
      })
    })

    experiment('when an object is provided', () => {
      test('applies the correct transformation to each item', () => {
        const result = digitise.transformNulls({
          notNulls: ['NOT_NULL', 'NOT_NULL_EITHER'],
          nulls: [null, 'null', '']
        })
        expect(result).to.equal({
          notNulls: ['NOT_NULL', 'NOT_NULL_EITHER'],
          nulls: [null, null, null]
        })
      })
    })
  })
})
