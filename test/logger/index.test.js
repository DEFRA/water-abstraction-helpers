'use strict'

const {
  beforeEach,
  experiment,
  test
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sinon = require('sinon')

const { createLogger, decorateError } = require('../../src/logger')

// Initialise logger
const logger = createLogger({
  level: 'info',
  airbrakeKey: 'test',
  airbrakeHost: 'test',
  airbrakeLevel: 'test',
  startFileNameAfter: 'test'
})

experiment('Test logger', () => {
  let spy

  beforeEach(async () => {
    spy = sinon.spy()
    logger.on('logged', spy)
  })

  experiment('when the type of message is passed to logger.log()', () => {
    test('It should log an error to the console', async () => {
      logger.log('error', 'A test')
      const [level, message, data] = spy.firstCall.args
      expect(level).to.equal('error')
      expect(message).to.equal('A test')
      expect(data).to.equal({})
    })

    test('It should log an info level message to the console', async () => {
      logger.log('info', 'A test')
      const [level, message, data] = spy.firstCall.args
      expect(level).to.equal('info')
      expect(message).to.equal('A test')
      expect(data).to.equal({})
    })

    test('It should log a warning level message to the console', async () => {
      logger.log('warn', 'A test')
      const [level, message, data] = spy.firstCall.args
      expect(level).to.equal('warn')
      expect(message).to.equal('A test')
      expect(data).to.equal({})
    })

    test('It should not log debug message - below the minimum logging level', async () => {
      logger.log('debug', 'A test')
      expect(spy.firstCall).to.equal(null)
    })
  })

  experiment('when the type of message is set by calling the method on the logger', () => {
    test('It should log an info level message to the console', async () => {
      logger.info('A test')
      const [level, message, data] = spy.firstCall.args
      expect(level).to.equal('info')
      expect(message).to.equal('A test')
      expect(data).to.equal({})
    })

    test('It should log a warning level message to the console', async () => {
      logger.warn('A test')
      const [level, message, data] = spy.firstCall.args
      expect(level).to.equal('warn')
      expect(message).to.equal('A test')
      expect(data).to.equal({})
    })

    test('It should not log debug message - below the minimum logging level', async () => {
      logger.debug('A test')
      expect(spy.firstCall).to.equal(null)
    })

    experiment('and we are logging an error', () => {
      experiment('but we do not pass an error', () => {
        test('It should log an error to the console', async () => {
          logger.error('A test')
          const [level, message, data] = spy.firstCall.args

          expect(level).to.equal('error')
          expect(message).to.equal('A test')
          expect(data).to.equal(undefined)
        })
      })

      experiment('and we pass a stacktrace (string) as the error', () => {
        test('It should log an error to the console', async () => {
          logger.error('A test', 'It failed at this point in the code')
          const [level, message, data] = spy.firstCall.args

          expect(level).to.equal('error')
          expect(message).to.equal('A test')
          expect(data).to.equal({
            stack: 'It failed at this point in the code',
            context: { component: '/logger/index.test.js:97:18' },
            params: {}
          })
        })
      })

      experiment('and we pass an instance of Error as the error', () => {
        test('It should log an error to the console', async () => {
          // Pass our error undecorated
          const testError = new Error('It failed')
          logger.error('A test', testError)

          // then decorate it in the same way the code will
          const deoratedError = decorateError(testError, {})

          const [level, message, data] = spy.firstCall.args

          expect(level).to.equal('error')
          expect(message).to.equal('A test')
          expect(data).to.equal(deoratedError)
        })
      })
    })
  })
})

experiment('decorateError', () => {
  test('returns undefined if the error is undefined', async () => {
    expect(decorateError()).to.be.undefined()
  })

  test('decorating the error leaves the original error properties', async () => {
    const err = new Error('oh no')
    const decorated = decorateError(err, { params: 'testing' })
    expect(decorated.message).to.equal('oh no')
  })

  test('adds the file name to the context', async () => {
    const err = new Error('oh no')
    const decorated = decorateError(err)
    expect(decorated.context.component).to.include('logger/index.test.js')
  })

  test('adds the file name and params to the error', async () => {
    const err = new Error('oh no')
    const decorated = decorateError(err, { test: true })
    expect(decorated.context.component).to.include('logger/index.test.js')
    expect(decorated.params.test).to.be.true()
  })
})
