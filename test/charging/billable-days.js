'use strict';

const { experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

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
  },
  doubleRange2: {
    startDay: 31,
    startMonth: 10,
    endDay: 1,
    endMonth: 4
  }
};

experiment('charging.getFinancialYear', () => {
  test('for dates before 1 April, returns same year', async () => {
    expect(charging.getFinancialYear('2018-01-01')).to.equal(2018);
    expect(charging.getFinancialYear('2018-03-31')).to.equal(2018);
  });

  test('for dates on or after 1 April, returns following year', async () => {
    expect(charging.getFinancialYear('2018-04-01')).to.equal(2019);
    expect(charging.getFinancialYear('2018-12-31')).to.equal(2019);
  });
});

experiment('charging.getFinancialYearDate', () => {
  test('for dates before 1 April, returns date with same year', async () => {
    expect(charging.getFinancialYearDate(1, 1, 2019)).to.equal('2019-01-01');
    expect(charging.getFinancialYearDate(31, 3, 2019)).to.equal('2019-03-31');
  });

  test('for dates on or after 1 April, returns dates with preceding year', async () => {
    expect(charging.getFinancialYearDate(1, 4, 2019)).to.equal('2018-04-01');
    expect(charging.getFinancialYearDate(31, 12, 2019)).to.equal('2018-12-31');
  });
});

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

  experiment('when the abs period ends on the 1st April', async () => {
    test('the first day of April is included for a full year', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange2, '2021-04-01', '2022-03-31');
      expect(result).to.equal(153);
    });

    test('the first day of April is not included when it is not in the charge period', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange2, '2021-04-02', '2022-03-31');
      expect(result).to.equal(152);
    });

    test('when the end date is before the start of the abs period, only 1 April is included', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange2, '2021-04-01', '2021-10-30');
      expect(result).to.equal(1);
    });

    test('when the end date is part-way through the abs period, calculates correct days', async () => {
      const result = charging.getBillableDays(absPeriods.doubleRange2, '2021-04-01', '2021-11-30');
      expect(result).to.equal(32);
    });
  });

  experiment('.getIntersection', () => {
    test('returns null when two ranges do not overlap', () => {
      expect(charging.getIntersection([
        ['2000-01-01', '2002-01-01'],
        ['2002-01-02', '2003-01-01']
      ])).to.equal(null);
    });

    test('returns a range when two ranges start/end same day', () => {
      expect(charging.getIntersection([
        ['2000-01-01', '2002-01-01'],
        ['2002-01-01', '2003-01-01']
      ])).to.equal(['2002-01-01', '2002-01-01']);
    });

    test('returns a range when two ranges overlap', () => {
      expect(charging.getIntersection([
        ['2000-01-01', '2002-01-01'],
        ['2001-01-01', '2003-01-01']
      ])).to.equal(['2001-01-01', '2002-01-01']);
    });
  });
});
