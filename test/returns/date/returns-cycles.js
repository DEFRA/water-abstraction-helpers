'use strict';

const moment = require('moment');
const { experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const { returns: { date: { createReturnCycles } } } = require('../../../src');

experiment('createReturnCycles', () => {
  test('It should create a single return cycle over an exact summer return date range', async () => {
    const result = createReturnCycles('2017-11-01', '2018-10-31');
    expect(result).to.equal([{
      startDate: '2017-11-01',
      endDate: '2018-10-31',
      isSummer: true
    }]);
  });

  test('It should create a single return cycle over an exact winter return date range', async () => {
    const result = createReturnCycles('2016-04-01', '2017-03-31');
    expect(result).to.equal([{
      startDate: '2016-04-01',
      endDate: '2017-03-31',
      isSummer: false
    }]);
  });

  test('It should create multiple return cycles over a non-exact return date range starting with summer', async () => {
    const result = createReturnCycles('2016-09-25', '2018-12-01');

    expect(result).to.equal([
      {
        startDate: '2016-11-01',
        endDate: '2017-10-31',
        isSummer: true
      },
      {
        startDate: '2017-04-01',
        endDate: '2018-03-31',
        isSummer: false
      },
      {
        startDate: '2017-11-01',
        endDate: '2018-10-31',
        isSummer: true
      }
    ]);
  });

  test('It should create multiple return cycles over a non-exact return date range starting with winter', async () => {
    const result = createReturnCycles('2016-02-14', '2018-12-01');
    expect(result).to.equal([
      {
        startDate: '2016-04-01',
        endDate: '2017-03-31',
        isSummer: false
      },
      {
        startDate: '2016-11-01',
        endDate: '2017-10-31',
        isSummer: true
      },
      {
        startDate: '2017-04-01',
        endDate: '2018-03-31',
        isSummer: false
      },
      {
        startDate: '2017-11-01',
        endDate: '2018-10-31',
        isSummer: true
      }
    ]);
  });

  test('It should create return cycles over a non-exact return date range in the year following the start date', async () => {
    const result = createReturnCycles('2016-12-01', '2018-03-31');
    expect(result).to.equal([
      {
        startDate: '2017-04-01',
        endDate: '2018-03-31',
        isSummer: false
      }
    ]);
  });

  test('It should create a single return cycle over an exact winter return date range', async () => {
    const result = createReturnCycles('2016-04-01', '2017-03-31');
    expect(result).to.equal([{
      startDate: '2016-04-01',
      endDate: '2017-03-31',
      isSummer: false
    }]);
  });

  test('It should default to 2017-11-01 as the first cycle start date', async () => {
    const result = createReturnCycles();
    expect(result[0].startDate).to.equal('2017-11-01');
  });

  test('Default last cycle end date should be in the past', async () => {
    const result = createReturnCycles();
    const endDate = result[result.length - 1].endDate;
    expect(moment(endDate).isSameOrBefore(moment(), 'day')).to.equal(true);
  });

  test('It should throw an error if start date is after end date', async () => {
    const func = () => {
      createReturnCycles('2018-10-31', '2018-10-30');
    };
    expect(func).to.throw();
  });

  test('It should create a winter and a summer cycle over an exact date range', async () => {
    const result = createReturnCycles('2017-11-01', '2019-03-31');
    expect(result).to.equal([{
      startDate: '2017-11-01',
      endDate: '2018-10-31',
      isSummer: true
    }, {
      startDate: '2018-04-01',
      endDate: '2019-03-31',
      isSummer: false
    }]);
  });
});
