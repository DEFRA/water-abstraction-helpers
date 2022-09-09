'use strict'

const { expect } = require('@hapi/code')
const { experiment, test, before } = exports.lab = require('@hapi/lab').script()
const Hapi = require('@hapi/hapi')

const { hapiPgBoss } = require('../../src/')
const sandbox = require('sinon').createSandbox()

const JOB_NAME = 'test-job'
const JOB_ID = 'test-id'
const JOB_OPTIONS = { foo: 'bar' }

experiment('hapi PG Boss', () => {
  test('the hapi plugin has the correct name', async () => {
    expect(hapiPgBoss.name).to.equal('pgBoss')
  })

  test('the hapi plugin has a regiser function', async () => {
    expect(hapiPgBoss.register).to.be.a.function()
  })

  experiment('when registered with a hapi server', () => {
    let server

    before(async () => {
      server = Hapi.server({
        port: 3000,
        host: 'localhost'
      })
      server.route({
        path: '/test',
        method: 'GET',
        handler: async request => {
          return request.messageQueue.publish(JOB_NAME, JOB_OPTIONS)
        }
      })
      await server.register({
        plugin: hapiPgBoss,
        options: {
          db: {
            executeSql: sandbox.stub().resolves({
              rows: [{
                id: JOB_ID
              }],
              rowCount: 1
            })
          }
        }
      })
    })

    test('PG boss is available on the server', async () => {
      const result = await server.messageQueue.publish(JOB_NAME, JOB_OPTIONS)
      expect(result).to.equal(JOB_ID)
    })

    test('PG boss is available on the request', async () => {
      const result = await server.inject({
        url: '/test',
        method: 'GET'
      })
      expect(result.payload).to.equal(JOB_ID)
    })
  })
})
