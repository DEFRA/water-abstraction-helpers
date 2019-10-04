const { expect } = require('code');
const { experiment, test, beforeEach } = exports.lab = require('lab').script();
const moment = require('moment');
moment.locale('en-gb');

const { dateRangeSplitter } = require('../../src/charging/date-range-splitter');

experiment('charging date range splitter', async () => {
  const chargeVersion = {
    startDate: '2018-04-01',
    endDate: '2019-03-31'
  };

  experiment('when the charge version is not split by any agreements', () => {
    let result;
    beforeEach(async () => {
      result = dateRangeSplitter(chargeVersion, [], 'agreement');
    });

    test('there is only 1 item in result set', async () => {
      expect(result.length).to.equal(1);
    });

    test('the effective dates are the same as the date ranges passed in', async () => {
      expect(result[0].effectiveStartDate).to.equal(chargeVersion.startDate);
      expect(result[0].effectiveEndDate).to.equal(chargeVersion.endDate);
    });

    test('the agreement property is null', async () => {
      expect(result[0].agreement).to.equal(null);
    });
  });

  experiment('when all agreements are outside the charge version date range', () => {
    let result;
    beforeEach(async () => {
      result = dateRangeSplitter(chargeVersion, [
        {
          startDate: '2017-04-01',
          endDate: '2018-03-31'
        }, {
          startDate: '2019-04-01',
          endDate: null
        }
      ], 'agreement');
    });

    test('there is only 1 item in result set', async () => {
      expect(result.length).to.equal(1);
    });

    test('the effective dates are the same as the date ranges passed in', async () => {
      expect(result[0].effectiveStartDate).to.equal(chargeVersion.startDate);
      expect(result[0].effectiveEndDate).to.equal(chargeVersion.endDate);
    });

    test('the agreement property is null', async () => {
      expect(result[0].agreement).to.equal(null);
    });
  });

  experiment('when an agreement is in effect for the entire duration of the charge version', () => {
    let result, agreements;
    beforeEach(async () => {
      agreements = [
        {
          startDate: '2017-04-01',
          endDate: null
        }
      ];
      result = dateRangeSplitter(chargeVersion, agreements, 'agreement');
    });

    test('there is only 1 item in result set', async () => {
      expect(result.length).to.equal(1);
    });

    test('the effective dates are the same as the date ranges passed in', async () => {
      expect(result[0].effectiveStartDate).to.equal(chargeVersion.startDate);
      expect(result[0].effectiveEndDate).to.equal(chargeVersion.endDate);
    });

    test('the agreement property is null', async () => {
      expect(result[0].agreement).to.equal(agreements[0]);
    });
  });

  experiment('when an agreement ends part-way through the charge version', () => {
    let result, agreements;
    beforeEach(async () => {
      agreements = [
        {
          startDate: '2017-04-01',
          endDate: '2018-05-01'
        }
      ];
      result = dateRangeSplitter(chargeVersion, agreements, 'agreement');
    });

    test('there are 2 items in result set', async () => {
      expect(result.length).to.equal(2);
    });

    test('the first array element has the correct date range', async () => {
      expect(result[0].effectiveStartDate).to.equal(chargeVersion.startDate);
      expect(result[0].effectiveEndDate).to.equal(agreements[0].endDate);
    });

    test('the first array element includes the agreement', async () => {
      expect(result[0].agreement).to.equal(agreements[0]);
    });

    test('the second array element has the correct date range', async () => {
      expect(result[1].effectiveStartDate).to.equal('2018-05-02');
      expect(result[1].effectiveEndDate).to.equal(chargeVersion.endDate);
    });

    test('the second item agreement property is null', async () => {
      expect(result[1].agreement).to.equal(null);
    });
  });

  experiment('when an agreement starts part-way through the charge version', () => {
    let result, agreements;
    beforeEach(async () => {
      agreements = [
        {
          startDate: '2018-06-15',
          endDate: null
        }
      ];
      result = dateRangeSplitter(chargeVersion, agreements, 'agreement');
    });

    test('there are 2 items in result set', async () => {
      expect(result.length).to.equal(2);
    });

    test('the first array element has the correct date range', async () => {
      expect(result[0].effectiveStartDate).to.equal(chargeVersion.startDate);
      expect(result[0].effectiveEndDate).to.equal('2018-06-14');
    });

    test('the first array element agreement property is null', async () => {
      expect(result[0].agreement).to.equal(null);
    });

    test('the second array element has the correct date range', async () => {
      expect(result[1].effectiveStartDate).to.equal(agreements[0].startDate);
      expect(result[1].effectiveEndDate).to.equal(chargeVersion.endDate);
    });

    test('the second item agreement property contains the agreement', async () => {
      expect(result[1].agreement).to.equal(agreements[0]);
    });
  });

  experiment('when agreements start and end part-way through the charge version', () => {
    let result, agreements;
    beforeEach(async () => {
      agreements = [
        {
          startDate: '2015-01-01',
          endDate: '2018-05-01'
        }, {
          startDate: '2018-07-04',
          endDate: '2019-03-31'
        }
      ];
      result = dateRangeSplitter(chargeVersion, agreements, 'agreement');
    });

    test('there are 3 items in result set', async () => {
      expect(result.length).to.equal(3);
    });

    test('the first array element has the correct date range', async () => {
      expect(result[0].effectiveStartDate).to.equal(chargeVersion.startDate);
      expect(result[0].effectiveEndDate).to.equal('2018-05-01');
    });

    test('the first array element has the correct agreement', async () => {
      expect(result[0].agreement).to.equal(agreements[0]);
    });

    test('the second array element has the correct date range', async () => {
      expect(result[1].effectiveStartDate).to.equal('2018-05-02');
      expect(result[1].effectiveEndDate).to.equal('2018-07-03');
    });

    test('the second array element has no agreement', async () => {
      expect(result[1].agreement).to.equal(null);
    });

    test('the third array element has the correct date range', async () => {
      expect(result[2].effectiveStartDate).to.equal('2018-07-04');
      expect(result[2].effectiveEndDate).to.equal(chargeVersion.endDate);
    });

    test('the second array element has the correct agreement', async () => {
      expect(result[2].agreement).to.equal(agreements[1]);
    });
  });
});
