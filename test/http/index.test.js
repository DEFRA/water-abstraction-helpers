'use strict'

const { experiment, test } = exports.lab = require('@hapi/lab').script()
const { fail, expect } = require('@hapi/code')
const sinon = require('sinon')

const http = require('../../src/http/index')

experiment('http', () => {
  experiment('.request', () => {
    test('can subscribe to onPreRequest to receive the options', async () => {
      const options = { wellFormed: false }
      let broadcastOptions
      http.onPreRequest(opt => (broadcastOptions = opt))

      try {
        await http.request(options)
        fail('test should not get here')
      } catch (e) {
        expect(broadcastOptions).to.equal(options)
      }
    })

    test('listeners can all be removed', async () => {
      const options = { wellFormed: false }
      const spy = sinon.spy()

      http.onPreRequest(spy)
      http.removePreRequestListener()

      try {
        await http.request(options)
        fail('test should not get here')
      } catch (e) {
        expect(spy.called).to.be.false()
      }
    })
  })
})
