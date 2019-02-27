const { first, last, uniq } = require('lodash');
const { expect } = require('code');
const {
  experiment,
  test
} = exports.lab = require('lab').script();

const {
  getDays,
  getWeeks,
  getMonths,
  getYears,
  getRequiredLines
} = require('../../src/returns/lines');

experiment('getWeeks', () => {
  test('returns a week starting on sunday', async () => {
    const lines = getWeeks('2018-11-04', '2018-11-10');
    expect(first(lines).startDate).to.equal('2018-11-04');
    expect(first(lines).endDate).to.equal('2018-11-10');
  });

  /**
   * Ensures that the last week does not bleed out of the
   * bounds of the return cycle.
   */
  test('the last full week does not cross the end date', async () => {
    const lines = getWeeks('2018-10-01', '2018-10-31');
    expect(last(lines).startDate).to.equal('2018-10-21');
    expect(last(lines).endDate).to.equal('2018-10-27');
  });

  test('generates a line for each week running Sunday - Saturday', async () => {
    const weeks = getWeeks('2018-01-01', '2018-12-31');

    expect(first(weeks).startDate).to.equal('2017-12-31');
    expect(first(weeks).endDate).to.equal('2018-01-06');

    expect(last(weeks).startDate).to.equal('2018-12-23');
    expect(last(weeks).endDate).to.equal('2018-12-29');
  });

  test('outputs "week" as the period', async () => {
    const days = getWeeks('2018-01-01', '2018-12-31');
    const periods = uniq(days.map(day => day.timePeriod));
    expect(periods.length).to.equal(1);
    expect(periods).to.equal(['week']);
  });
});

experiment('getDays', () => {
  test('generates a line for each day', async () => {
    const days = getDays('2018-01-01', '2018-12-31');
    expect(days.length).to.equal(365);
  });

  test('generates a line for each day on leap years', async () => {
    const days = getDays('2020-01-01', '2020-12-31');
    expect(days.length).to.equal(366);
  });

  test('generates correct lines', async () => {
    const days = getDays('2018-01-20', '2018-02-10');
    expect(first(days).startDate).to.equal('2018-01-20');
    expect(first(days).endDate).to.equal('2018-01-20');
    expect(last(days).startDate).to.equal('2018-02-10');
    expect(last(days).endDate).to.equal('2018-02-10');
  });

  test('outputs `day` as the period', async () => {
    const days = getDays('2018-01-01', '2018-12-31');
    const periods = uniq(days.map(day => day.timePeriod));
    expect(periods).to.equal(['day']);
  });
});

experiment('getMonths', () => {
  test('generates a line for each month', async () => {
    const months = getMonths('2018-01-01', '2018-12-31');
    expect(months.length).to.equal(12);
  });

  test('outputs `month` as the period', async () => {
    const days = getMonths('2018-01-01', '2018-12-31');
    const periods = uniq(days.map(day => day.timePeriod));
    expect(periods).to.equal(['month']);
  });

  test('generates correct months', async () => {
    const months = getMonths('2018-01-01', '2018-12-31');
    expect(months).to.equal([
      { startDate: '2018-01-01', endDate: '2018-01-31', timePeriod: 'month' },
      { startDate: '2018-02-01', endDate: '2018-02-28', timePeriod: 'month' },
      { startDate: '2018-03-01', endDate: '2018-03-31', timePeriod: 'month' },
      { startDate: '2018-04-01', endDate: '2018-04-30', timePeriod: 'month' },
      { startDate: '2018-05-01', endDate: '2018-05-31', timePeriod: 'month' },
      { startDate: '2018-06-01', endDate: '2018-06-30', timePeriod: 'month' },
      { startDate: '2018-07-01', endDate: '2018-07-31', timePeriod: 'month' },
      { startDate: '2018-08-01', endDate: '2018-08-31', timePeriod: 'month' },
      { startDate: '2018-09-01', endDate: '2018-09-30', timePeriod: 'month' },
      { startDate: '2018-10-01', endDate: '2018-10-31', timePeriod: 'month' },
      { startDate: '2018-11-01', endDate: '2018-11-30', timePeriod: 'month' },
      { startDate: '2018-12-01', endDate: '2018-12-31', timePeriod: 'month' }
    ]);
  });

  test('generates a month if the start date is anywhere within the month', async () => {
    const months = getMonths('2018-03-15', '2018-03-16');
    expect(months).to.equal([
      {
        startDate: '2018-03-01',
        endDate: '2018-03-31',
        timePeriod: 'month'
      }
    ]);
  });

  test('generates a month if the end date is anywhere within the month', async () => {
    const months = getMonths('2018-03-15', '2018-04-01');
    expect(months).to.equal([
      { startDate: '2018-03-01', endDate: '2018-03-31', timePeriod: 'month' },
      { startDate: '2018-04-01', endDate: '2018-04-30', timePeriod: 'month' }
    ]);
  });
});

experiment('getYears', () => {
  test('generates a line for the whole date range', async () => {
    const years = getYears('2018-01-01', '2019-12-31');

    expect(years).to.have.length(1);
    expect(first(years).startDate).to.equal('2018-01-01');
    expect(first(years).endDate).to.equal('2019-12-31');
  });

  test('outputs "year" as the period', async () => {
    const years = getYears('2018-01-01', '2019-12-31');
    expect(first(years).timePeriod).to.equal('year');
  });
});

experiment('getRequiredLines', () => {
  test('generates daily lines', async () => {
    const lines = getRequiredLines('2018-01-01', '2018-12-31', 'day');
    expect(first(lines).timePeriod).to.equal('day');
  });

  test('generates weekly lines', async () => {
    const lines = getRequiredLines('2018-01-01', '2018-12-31', 'week');
    expect(first(lines).timePeriod).to.equal('week');
  });

  test('generates monthly lines', async () => {
    const lines = getRequiredLines('2018-01-01', '2018-12-31', 'month');
    expect(first(lines).timePeriod).to.equal('month');
  });

  test('generates yearly lines', async () => {
    const lines = getRequiredLines('2018-01-01', '2018-12-31', 'year');
    expect(first(lines).timePeriod).to.equal('year');
  });

  test('throws for an unknown frequency', async () => {
    const func = function () {
      getRequiredLines('2018-01-01', '2018-12-31', 'not a frequency');
    };

    expect(func).to.throw();
  });
});
