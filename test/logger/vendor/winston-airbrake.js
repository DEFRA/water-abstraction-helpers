const Lab = require('lab');

const lab = Lab.script();
const { expect } = require('code');

const { createNotice } = require('../../../src/logger/vendor/winston-airbrake.js');


lab.experiment('Test createNotice for Airbrake client using error object', () => {

  const err = new Error('Test error');
  err.params = {
    foo : 'bar'
  };
  err.context = 'context info'
  const notice = createNotice('info', 'Oh no', err);

  lab.test('Notice should have correct error level', async () => {
    expect(notice.error.type).to.equal('info');
  });

  lab.test('Notice should contain correct message', async () => {
    expect(notice.error.message).to.equal('Test error');
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
      foo : 'bar'
  }
  err.context = 'context info'
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


exports.lab = lab;
