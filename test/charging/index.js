const {
  experiment,
  test
} = exports.lab = require('lab').script();
const { expect } = require('code');

const charging = require('../../src/charging');

const absPeriods = {
  allYear: {
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 12
  },
  singleRange: {
    startDay: 1,
    startMonth: 4,
    endDay: 31,
    endMonth: 10
  },
  doubleRange: {
    startDay: 1,
    startMonth: 12,
    endDay: 30,
    endMonth: 4
  }
};

experiment('charging.getTotalDays', () => {
  test('a full financial not containing a leap year gives 365 chargeable days', async () => {
    const result = charging.getTotalDays('2018-04-01', '2019-03-31');
    expect(result).to.equal(365);
  });

  test('a full financial containing a leap year gives 366 chargeable days', async () => {
    const result = charging.getTotalDays('2019-04-01', '2020-03-31');
    expect(result).to.equal(366);
  });
});

experiment('charging.getBillableDays', () => {
  test('all-year abstraction in a financial year not containing a leap year gives 365 days', async () => {
    const result = charging.getBillableDays(absPeriods.allYear, '2018-04-01', '2019-03-31');
    expect(result).to.equal(365);
  });

  test('all-year abstraction in a financial year containing a leap year gives 366 days', async () => {
    const result = charging.getBillableDays(absPeriods.allYear, '2019-04-01', '2020-03-31');
    expect(result).to.equal(366);
  });

  experiment('when the abs period is a single range within a calendar year', async () => {
    test('for a full year, the result is the days within the abs period', async () => {
      const result = charging.getBillableDays(absPeriods.singleRange, '2018-04-01', '2019-03-31');
      expect(result).to.equal(214);
    });

    test('when the end date is on or after the end of the abs period, the billable days are unaffected', async () => {
      const result = charging.getBillableDays(absPeriods.singleRange, '2018-04-01', '2018-10-31');
      expect(result).to.equal(214);
    });

    test('when the end date is before the end of the abs period, the billable days are reduced', async () => {
      const result = charging.getBillableDays(absPeriods.singleRange, '2018-04-01', '2018-09-30');
      expect(result).to.equal(183);
    });

    test('when the start date is after the start of the abs period, the billable days are reduced', async () => {
      const result = charging.getBillableDays(absPeriods.singleRange, '2018-05-01', '2019-03-31');
      expect(result).to.equal(184);
    });

    test('when there are no billable days, zero is returned', async () => {
      const result = charging.getBillableDays(absPeriods.singleRange, '2018-11-01', '2019-03-31');
      expect(result).to.equal(0);
    });
  });

  experiment('when the abs period is two ranges within a calendar year', async () => {
    test('for a full year, the result is the days within the abs period', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange, '2018-04-01', '2019-03-31');
      expect(result).to.equal(151);
    });

    test('when the end date is before the end of the abs period, the billable days are reduced', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange, '2018-04-01', '2018-12-31');
      expect(result).to.equal(61);
    });

    test('when the start date is after the start of the abs period, the billable days are reduced', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange, '2018-05-01', '2019-03-31');
      expect(result).to.equal(121);
    });

    test('when there are no billable days, zero is returned', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange, '2018-05-01', '2018-11-30');
      expect(result).to.equal(0);
    });
  });
});
