const Lab = require('lab');

const lab = Lab.script();
const { expect } = require('code');
const sinon = require('sinon');
const logger = require('../../src/logger');

const winston = require('winston');
const AirbrakeClient = require('airbrake-js');

// Initialise logger
const result = logger.init({
  level: 'info',
  airbrakeKey: 'test',
  airbrakeHost: 'test',
  airbrakeLevel: 'test'
});

lab.experiment('Test logger', () => {

  let spy;

  lab.beforeEach(async() => {
    spy = sinon.spy();
    logger.on('logged', spy);
  });

  lab.test('It should log an error to the console', async () => {
    logger.log('error', 'A test');
    const [level, message, data] = spy.firstCall.args;
    expect(level).to.equal('error');
    expect(message).to.equal('A test');
    expect(data).to.equal({});
  });

  lab.test('It should log an info level message to the console', async () => {
    logger.log('info', 'A test');
    const [level, message, data] = spy.firstCall.args;
    expect(level).to.equal('info');
    expect(message).to.equal('A test');
    expect(data).to.equal({});
  });

  lab.test('It should log a warning level message to the console', async () => {
    logger.log('warn', 'A test');
    const [level, message, data] = spy.firstCall.args;
    expect(level).to.equal('warn');
    expect(message).to.equal('A test');
    expect(data).to.equal({});
  });

  lab.test('It should not log debug message - below the minimum logging level', async () => {
    logger.log('debug', 'A test');
    expect(spy.firstCall).to.equal(null);
  });
});



exports.lab = lab;
