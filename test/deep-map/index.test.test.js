'use strict'

const {
  before,
  experiment,
  test
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const { trim } = require('lodash')

// Thing to test
const deepMap = require('../../src/deep-map')

experiment('deep-map/index.js', () => {
  experiment('when an object is provided', () => {
    let object

    before(() => {
      object = {
        a: ' a ',
        b: {
          b1: ' b1 ',
          b2: ' b2 '
        }
      }
    })

    test('recursively applies a function to every item', async () => {
      const result = deepMap(object, item => trim(item))
      expect(result).to.equal({
        a: 'a',
        b: {
          b1: 'b1',
          b2: 'b2'
        }
      })
    })
  })

  experiment('when an array is provided', () => {
    let array

    before(() => {
      array = [' a ', ' b ', ' c ']
    })

    test('applies a function to every item', async () => {
      const result = deepMap(array, item => trim(item))
      expect(result).to.equal(['a', 'b', 'c'])
    })
  })

  experiment('when a string is provided', () => {
    let string

    before(() => {
      string = ' abc '
    })

    test('applies a function to it', async () => {
      const result = deepMap(string, item => trim(item))
      expect(result).to.equal('abc')
    })
  })

  experiment('when a number is provided', () => {
    let number

    before(() => {
      number = 123
    })

    test('applies a function to it', async () => {
      const result = deepMap(number, num => num * 2)
      expect(result).to.equal(number * 2)
    })
  })
})
