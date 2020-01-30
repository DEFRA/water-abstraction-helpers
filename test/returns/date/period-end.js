'use strict';

const { experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const { returns: { date: { getPeriodEnd } } } = require('../../../src');

experiment('getPeriodEnd - winter', () => {
  // ---------- getPeriodEnd - winter
  test('getPeriodEnd for winter year return in same year', async () => {
    expect(getPeriodEnd('2018-05-01')).to.equal('2019-03-31');
  });
  test('getPeriodEnd for winter year return in different year', async () => {
    expect(getPeriodEnd('2018-02-01')).to.equal('2018-03-31');
  });
  test('getPeriodEnd for winter year return on period start date', async () => {
    expect(getPeriodEnd('2018-04-01')).to.equal('2019-03-31');
  });
  test('getPeriodEnd for winter year return on period end date', async () => {
    expect(getPeriodEnd('2018-03-31')).to.equal('2018-03-31');
  });
});

experiment('getPeriodEnd - summer', () => {
// ---------- getPeriodEnd - summer
  test('getPeriodEnd for summer year return in same year', async () => {
    expect(getPeriodEnd('2018-12-01', true)).to.equal('2019-10-31');
  });
  test('getPeriodEnd for summer year return in different year', async () => {
    expect(getPeriodEnd('2018-02-01', true)).to.equal('2018-10-31');
  });
  test('getPeriodEnd for summer year return on period start date', async () => {
    expect(getPeriodEnd('2018-11-01', true)).to.equal('2019-10-31');
  });
  test('getPeriodEnd for summer year return on period end date', async () => {
    expect(getPeriodEnd('2018-10-31', true)).to.equal('2018-10-31');
  });
});
