const Lab = require('lab');

const lab = Lab.script();
const { expect } = require('code');

const { createNotice, createClientOptions, Airbrake } = require('../../../src/logger/vendor/winston-airbrake.js');

lab.experiment('Test createNotice for Airbrake client using error object', () => {
  const err = new Error('Test error');
  err.params = {
    foo: 'bar'
  };
  err.context = 'context info';
  const notice = createNotice('info', 'Oh no', err);

  lab.test('Notice should have correct error level', async () => {
    expect(notice.error.type).to.equal('info');
  });

  lab.test('Notice should contain correct message', async () => {
    expect(notice.error.message).to.equal(err.message);
  });

  lab.test('For error objects, supplied message is sent as a param', async () => {
    expect(notice.params.message).to.equal('Oh no');
  });

  lab.test('Params on an error are attached to the notice', async () => {
    expect(notice.params.foo).to.equal(err.params.foo);
  });

  lab.test('Context on an error is attached to the notice', async () => {
    expect(notice.context).to.equal(err.context);
  });
});

lab.experiment('Test createNotice for Airbrake client using a plain object', () => {
  const err = {};
  err.params = {
    foo: 'bar'
  };
  err.context = 'context info';
  const notice = createNotice('debug', 'Oh no', err);

  lab.test('Notice should have correct error level', async () => {
    expect(notice.error.type).to.equal('debug');
  });

  lab.test('Notice should contain correct message', async () => {
    expect(notice.error.message).to.equal('Oh no');
  });

  lab.test('Params on an error are attached to the notice', async () => {
    expect(notice.params.foo).to.equal(err.params.foo);
  });

  lab.test('Context on an error is attached to the notice', async () => {
    expect(notice.context).to.equal(err.context);
  });
});

lab.experiment('Test createNotice for Airbrake client using message only', () => {
  const notice = createNotice('error', 'Oh no');

  lab.test('Notice should have correct error level', async () => {
    expect(notice.error.type).to.equal('error');
  });

  lab.test('Notice should contain correct message', async () => {
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

lab.experiment('Test createClientOptions', () => {
  const clientOptions = createClientOptions(options);

  lab.test('projectId should be set in client options', async () => {
    expect(clientOptions.projectId).to.equal(options.projectId);
  });

  lab.test('projectKey should be set in client options', async () => {
    expect(clientOptions.projectKey).to.equal(options.apiKey);
  });

  lab.test('host should be set in client options', async () => {
    expect(clientOptions.host).to.equal(options.host);
  });

  lab.test('request should not be set if no proxy', async () => {
    expect(clientOptions.request).to.equal(undefined);
  });

  lab.test('request should be set if proxy', async () => {
    const optionsWithProxy = {
      ...options,
      proxy: 'http://proxy'
    };
    expect(createClientOptions(optionsWithProxy).request).to.be.a.function();
  });
});

lab.experiment('Test setting Airbrake options', () => {
  const airbrake = new Airbrake(options);

  lab.test('name should be `airbrake`', async () => {
    expect(airbrake.name).to.equal('airbrake');
  });

  lab.test('level should match that in the options', async () => {
    expect(airbrake.level).to.equal(options.level);
  });

  lab.test('default minimum logging level is info', async () => {
    const { level, ...rest } = options;
    const ab = new Airbrake(rest);
    expect(ab.level).to.equal('info');
  });

  lab.test('silent should match that in the options', async () => {
    expect(airbrake.silent).to.equal(options.silent);
  });

  lab.test('silent mode should be disabled by default', async () => {
    const { silent, ...rest } = options;
    const ab = new Airbrake(rest);
    expect(ab.silent).to.equal(false);
  });

  lab.test('handleExceptions should match that in the options', async () => {
    expect(airbrake.handleExceptions).to.equal(options.handleExceptions);
  });

  lab.test('handleExceptions should be disabled by default', async () => {
    const { handleExceptions, ...rest } = options;
    const ab = new Airbrake(rest);
    expect(ab.handleExceptions).to.equal(false);
  });

  lab.test('should throw an error if no API key supplied', async () => {
    const { apiKey, ...rest } = options;
    const func = () => {
      return new Airbrake(rest);
    };
    expect(func).to.throw();
  });
});

exports.lab = lab;
