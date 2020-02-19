'use strict';

const { experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const { createNotice, createClientOptions, Airbrake } = require('../../../src/logger/vendor/winston-airbrake.js');

experiment('Test createNotice for Airbrake client using error object', () => {
  const err = new Error('Test error');
  err.params = {
    foo: 'bar'
  };
  err.context = 'context info';
  const notice = createNotice('info', 'Oh no', err);

  test('Notice should have correct error level', async () => {
    expect(notice.error.type).to.equal('info');
  });

  test('Notice should contain correct message', async () => {
    expect(notice.error.message).to.equal(err.message);
  });

  test('For error objects, supplied message is sent as a param', async () => {
    expect(notice.params.message).to.equal('Oh no');
  });

  test('Params on an error are attached to the notice', async () => {
    expect(notice.params.foo).to.equal(err.params.foo);
  });

  test('Context on an error is attached to the notice', async () => {
    expect(notice.context).to.equal(err.context);
  });
});

experiment('Test createNotice for Airbrake client using a plain object', () => {
  const err = {};
  err.params = {
    foo: 'bar'
  };
  err.context = 'context info';
  const notice = createNotice('debug', 'Oh no', err);

  test('Notice should have correct error level', async () => {
    expect(notice.error.type).to.equal('debug');
  });

  test('Notice should contain correct message', async () => {
    expect(notice.error.message).to.equal('Oh no');
  });

  test('Params on an error are attached to the notice', async () => {
    expect(notice.params.foo).to.equal(err.params.foo);
  });

  test('Context on an error is attached to the notice', async () => {
    expect(notice.context).to.equal(err.context);
  });
});

experiment('Test createNotice for Airbrake client using message only', () => {
  const notice = createNotice('error', 'Oh no');

  test('Notice should have correct error level', async () => {
    expect(notice.error.type).to.equal('error');
  });

  test('Notice should contain correct message', async () => {
    expect(notice.error.message).to.equal('Oh no');
  });
});

const options = {
  projectId: 'x',
  host: 'http://localhost',
  level: 'warning',
  silent: false,
  handleExceptions: true,
  apiKey: 'xyz'
};

experiment('Test createClientOptions', () => {
  const clientOptions = createClientOptions(options);

  test('projectId should be set in client options', async () => {
    expect(clientOptions.projectId).to.equal(options.projectId);
  });

  test('projectKey should be set in client options', async () => {
    expect(clientOptions.projectKey).to.equal(options.apiKey);
  });

  test('host should be set in client options', async () => {
    expect(clientOptions.host).to.equal(options.host);
  });

  test('request should not be set if no proxy', async () => {
    expect(clientOptions.request).to.equal(undefined);
  });

  test('request should be set if proxy', async () => {
    const optionsWithProxy = {
      ...options,
      proxy: 'http://proxy'
    };
    expect(createClientOptions(optionsWithProxy).request).to.be.a.function();
  });
});

experiment('Test setting Airbrake options', () => {
  const airbrake = new Airbrake(options);

  test('name should be `airbrake`', async () => {
    expect(airbrake.name).to.equal('airbrake');
  });

  test('level should match that in the options', async () => {
    expect(airbrake.level).to.equal(options.level);
  });

  test('default minimum logging level is info', async () => {
    const { level, ...rest } = options;
    const ab = new Airbrake(rest);
    expect(ab.level).to.equal('info');
  });

  test('silent should match that in the options', async () => {
    expect(airbrake.silent).to.equal(options.silent);
  });

  test('silent mode should be disabled by default', async () => {
    const { silent, ...rest } = options;
    const ab = new Airbrake(rest);
    expect(ab.silent).to.equal(false);
  });

  test('handleExceptions should match that in the options', async () => {
    expect(airbrake.handleExceptions).to.equal(options.handleExceptions);
  });

  test('handleExceptions should be disabled by default', async () => {
    const { handleExceptions, ...rest } = options;
    const ab = new Airbrake(rest);
    expect(ab.handleExceptions).to.equal(false);
  });

  test('should throw an error if no API key supplied', async () => {
    const { apiKey, ...rest } = options;
    const func = () => {
      return new Airbrake(rest);
    };
    expect(func).to.throw();
  });
});
