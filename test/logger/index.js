const {
  beforeEach,
  experiment,
  test
} = exports.lab = require('lab').script();
const { expect } = require('code');
const sinon = require('sinon');
const logger = require('../../src/logger');

// Initialise logger
logger.init({
  level: 'info',
  airbrakeKey: 'test',
  airbrakeHost: 'test',
  airbrakeLevel: 'test'
});

experiment('Test logger', () => {
  let spy;

  beforeEach(async () => {
    spy = sinon.spy();
    logger.on('logged', spy);
  });

  test('It should log an error to the console', async () => {
    logger.log('error', 'A test');
    const [level, message, data] = spy.firstCall.args;
    expect(level).to.equal('error');
    expect(message).to.equal('A test');
    expect(data).to.equal({});
  });

  test('It should log an info level message to the console', async () => {
    logger.log('info', 'A test');
    const [level, message, data] = spy.firstCall.args;
    expect(level).to.equal('info');
    expect(message).to.equal('A test');
    expect(data).to.equal({});
  });

  test('It should log a warning level message to the console', async () => {
    logger.log('warn', 'A test');
    const [level, message, data] = spy.firstCall.args;
    expect(level).to.equal('warn');
    expect(message).to.equal('A test');
    expect(data).to.equal({});
  });

  test('It should not log debug message - below the minimum logging level', async () => {
    logger.log('debug', 'A test');
    expect(spy.firstCall).to.equal(null);
  });
});

experiment('decorateError', () => {
  test('returns undefined if the error is undefined', async () => {
    expect(logger.decorateError()).to.be.undefined();
  });

  test('decorating the error leaves the original error properties', async () => {
    const err = new Error('oh no');
    const decorated = logger.decorateError(err, { params: 'testing' });
    expect(decorated.message).to.equal('oh no');
  });

  test('adds the file name to the context', async () => {
    const err = new Error('oh no');
    const decorated = logger.decorateError(err);
    expect(decorated.context.component).to.include(__filename);
  });

  test('adds the file name and params to the error', async () => {
    const err = new Error('oh no');
    const decorated = logger.decorateError(err, { test: true });
    expect(decorated.context.component).to.include(__filename);
    expect(decorated.params.test).to.be.true();
  });
});
