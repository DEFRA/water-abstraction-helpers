'use strict'

require('dotenv').config()

const {
  beforeEach,
  experiment,
  test,
  afterEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const db = require('../../src/db')

const config = {
  connectionString: process.env.DATABASE_URL,
  max: 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
}

experiment('db/index.js', () => {
  afterEach(async () => {
    sandbox.restore()
  })

  experiment('createPool', () => {
    let pool, logger

    beforeEach(async () => {
      logger = {
        error: sandbox.stub(),
        info: sandbox.stub()
      }

      pool = db.createPool(config, logger)
    })

    test('pool is an instance of pg.Pool', async () => {
      expect(pool.constructor.name).to.equal('BoundPool')
    })

    experiment('when a client errors', () => {
      const err = new Error('some terrible problem')

      beforeEach(async () => {
        pool.emit('error', err)
      })

      test('an error message is logged', async () => {
        const { args } = logger.error.lastCall
        expect(args[0]).to.equal('Database pool error')
        expect(args[1]).to.equal(err)
      })
    })
  })

  experiment('.mapQueryToKnex', () => {
    test('when there are no params', async () => {
      const QUERY = 'select some_column from some_table'
      const result = db.mapQueryToKnex(QUERY)
      expect(result).to.equal([QUERY])
    })

    test('when there are bound params', async () => {
      const QUERY = 'select * from some_table where column_a=$1 and column_b=$2 order by column_a=$1'
      const PARAMS = ['foo', 'bar']
      const result = db.mapQueryToKnex(QUERY, PARAMS)

      expect(result[0]).to.equal('select * from some_table where column_a=:param_0 and column_b=:param_1 order by column_a=:param_0')
      expect(result[1]).to.equal(
        {
          param_0: PARAMS[0],
          param_1: PARAMS[1]
        }
      )
    })
  })
})
