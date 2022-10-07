'use strict'

const { experiment, test } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

const { regions: { getRegion } } = require('../../src')

experiment('getRegion', () => {
  test('It should return a region when passed a numeric region code', async () => {
    expect(getRegion(1)).to.equal('Anglian')
  })

  test('It should return a region when passed a string region code', async () => {
    expect(getRegion('8')).to.equal('Wales')
  })

  test('It should return undefined for an invalid region', async () => {
    expect(getRegion(9)).to.equal(undefined)
  })
})
