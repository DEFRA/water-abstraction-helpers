'use strict';

const { experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const { returns: { date: { getPeriodStart } } } = require('../../../src');

experiment('getPeriodStart - winter', () => {
  // ---------- getPeriodStart - winter
  test('getPeriodStart for winter year return in same year', async () => {
    expect(getPeriodStart('2018-05-01')).to.equal('2018-04-01');
  });
  test('getPeriodStart for winter year return in different year', async () => {
    expect(getPeriodStart('2018-02-01')).to.equal('2017-04-01');
  });
  test('getPeriodStart for winter year return on period start date', async () => {
    expect(getPeriodStart('2018-04-01')).to.equal('2018-04-01');
  });
  test('getPeriodStart for winter year return on period end date', async () => {
    expect(getPeriodStart('2018-03-31')).to.equal('2017-04-01');
  });
});

experiment('getPeriodStart - summer', () => {
// ---------- getPeriodStart - summer
  test('getPeriodStart for summer year return in same year', async () => {
    expect(getPeriodStart('2018-12-01', true)).to.equal('2018-11-01');
  });
  test('getPeriodStart for summer year return in different year', async () => {
    expect(getPeriodStart('2018-02-01', true)).to.equal('2017-11-01');
  });
  test('getPeriodStart for summer year return on period start date', async () => {
    expect(getPeriodStart('2018-11-01', true)).to.equal('2018-11-01');
  });
  test('getPeriodStart for summer year return on period end date', async () => {
    expect(getPeriodStart('2018-10-31', true)).to.equal('2017-11-01');
  });
});
