const {
  experiment,
  test
} = exports.lab = require('lab').script();
const { expect } = require('code');

const { returns: { date: { isDateWithinAbstractionPeriod } } } = require('../../../src');

const sameYear = {
  periodStartDay: 5,
  periodStartMonth: 3,
  periodEndDay: 25,
  periodEndMonth: 12
};

const sameYearStrings = {
  periodStartDay: '5',
  periodStartMonth: '3',
  periodEndDay: '25',
  periodEndMonth: '12'
};

const differentYear = {
  periodStartDay: 1,
  periodStartMonth: 10,
  periodEndDay: 8,
  periodEndMonth: 6
};

const differentYearStrings = {
  periodStartDay: '1',
  periodStartMonth: '10',
  periodEndDay: '8',
  periodEndMonth: '6'
};

const allYear = {
  periodStartDay: 1,
  periodStartMonth: 1,
  periodEndDay: 31,
  periodEndMonth: 12
};

const allYearStrings = {
  periodStartDay: '1',
  periodStartMonth: '1',
  periodEndDay: '31',
  periodEndMonth: '12'
};

const invalid = {
  periodStartDay: 1,
  periodStartMonth: 1,
  periodEndDay: 31,
  periodEndMonth: 13
};

experiment('Test isDateWithinAbstractionPeriod', () => {
  test('Period start/end in same year', async () => {
    expect(isDateWithinAbstractionPeriod('2018-01-01', sameYear)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-03-04', sameYear)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-03-05', sameYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-25', sameYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-26', sameYear)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-12-31', sameYear)).to.equal(false);
  });

  test('Period start/end in same year - abstraction period as strings', async () => {
    expect(isDateWithinAbstractionPeriod('2018-01-01', sameYearStrings)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-03-04', sameYearStrings)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-03-05', sameYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-25', sameYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-26', sameYearStrings)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-12-31', sameYearStrings)).to.equal(false);
  });

  test('Period start/end in different year', async () => {
    expect(isDateWithinAbstractionPeriod('2018-09-30', differentYear)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-10-01', differentYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-31', differentYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-01-01', differentYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-06-08', differentYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-06-09', differentYear)).to.equal(false);
  });

  test('Period start/end in different year - abstraction period as strings', async () => {
    expect(isDateWithinAbstractionPeriod('2018-09-30', differentYearStrings)).to.equal(false);
    expect(isDateWithinAbstractionPeriod('2018-10-01', differentYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-31', differentYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-01-01', differentYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-06-08', differentYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-06-09', differentYearStrings)).to.equal(false);
  });

  test('Period all year', async () => {
    expect(isDateWithinAbstractionPeriod('2017-12-31', allYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-01-01', allYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-31', allYear)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-01-01', allYear)).to.equal(true);
  });

  test('Period all year - abstraction period as strings', async () => {
    expect(isDateWithinAbstractionPeriod('2017-12-31', allYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-01-01', allYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2018-12-31', allYearStrings)).to.equal(true);
    expect(isDateWithinAbstractionPeriod('2019-01-01', allYearStrings)).to.equal(true);
  });

  test('Throws an error when abstraction period is invalid', async () => {
    const func = () => isDateWithinAbstractionPeriod('2019-01-01', invalid);
    expect(func).to.throw();
  });
});
