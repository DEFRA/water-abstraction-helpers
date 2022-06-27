'use strict'

const {
  experiment,
  test
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')

const mappers = require('../../src/returns/mappers')

experiment('returns/mappers', () => {
  experiment('.getStartDate', () => {
    test('a weekly date starts on a sunday', async () => {
      const wednesday = '2018-11-14'
      const sunday = '2018-11-11'
      expect(mappers.getStartDate('2018-11-11', wednesday, 'week')).to.equal(sunday)
    })
  })
})
