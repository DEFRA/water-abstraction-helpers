const moment = require('moment');
const Lab = require('lab');

const lab = Lab.script();
const { expect } = require('code');

const { returns: { date: { createReturnCycles } } } = require('../../../src');

lab.experiment('createReturnCycles', () => {
  lab.test('It should create a single return cycle over an exact summer return date range', async () => {
    const result = createReturnCycles('2017-11-01', '2018-10-31');
    expect(result).to.equal([{
      startDate: '2017-11-01',
      endDate: '2018-10-31',
      isSummer: true
    }]);
  });

  lab.test('It should create a single return cycle over an exact winter return date range', async () => {
    const result = createReturnCycles('2016-04-01', '2017-03-31');
    expect(result).to.equal([{
      startDate: '2016-04-01',
      endDate: '2017-03-31',
      isSummer: false
    }]);
  });

  lab.test('It should create multiple return cycles over a non-exact return date range starting with summer', async () => {
    const result = createReturnCycles('2016-09-25', '2018-12-01');

    expect(result).to.equal([
      {
        startDate: '2016-11-01',
        endDate: '2017-10-31',
        isSummer: true
      },
      {
        startDate: '2017-11-01',
        endDate: '2018-10-31',
        isSummer: true
      }
    ]);
  });

  lab.test('It should create multiple return cycles over a non-exact return date range starting with winter', async () => {
    const result = createReturnCycles('2016-02-14', '2019-12-01');
    expect(result).to.equal([
      {
        'startDate': '2016-04-01',
        'endDate': '2017-03-31',
        'isSummer': false
      },
      {
        'startDate': '2017-04-01',
        'endDate': '2018-03-31',
        'isSummer': false
      },
      {
        'startDate': '2018-04-01',
        'endDate': '2019-03-31',
        'isSummer': false
      }
    ]);
  });

  lab.test('It should create return cycles over a non-exact return date range in the year following the start date', async () => {
    const result = createReturnCycles('2016-12-01', '2018-03-31');
    expect(result).to.equal([
      {
        'startDate': '2017-04-01',
        'endDate': '2018-03-31',
        'isSummer': false
      }
    ]);
  });

  lab.test('It should create a single return cycle over an exact winter return date range', async () => {
    const result = createReturnCycles('2016-04-01', '2017-03-31');
    expect(result).to.equal([{
      startDate: '2016-04-01',
      endDate: '2017-03-31',
      isSummer: false
    }]);
  });

  lab.test('It should default to 2017-11-01 as the first cycle start date', async () => {
    const result = createReturnCycles();
    expect(result[0].startDate).to.equal('2017-11-01');
  });

  lab.test('Default last cycle end date should be in the past', async () => {
    const result = createReturnCycles();
    const endDate = result[result.length - 1].endDate;
    expect(moment(endDate).isSameOrBefore(moment(), 'day')).to.equal(true);
  });

  lab.test('It should throw an error if start date is after end date', async () => {
    const func = () => {
      createReturnCycles('2018-10-31', '2018-10-30');
    };
    expect(func).to.throw();
  });
});

exports.lab = lab;
