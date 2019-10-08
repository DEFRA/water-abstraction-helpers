const { expect } = require('code');
const { experiment, test } = exports.lab = require('lab').script();
const moment = require('moment');
moment.locale('en-gb');

const { mergeHistory } = require('../../src/charging');

experiment('charging.mergeHistory', () => {
  const a1 = {
    id: 'a',
    startDate: '2018-04-01',
    endDate: '2019-03-31'
  };
  const a2 = {
    id: 'a',
    startDate: '2018-04-01',
    endDate: null
  };
  const a3 = {
    id: 'a',
    startDate: '2019-04-01',
    endDate: '2019-08-01'
  };
  const a4 = {
    id: 'a',
    startDate: '2019-04-02',
    endDate: null
  };
  const b = {
    id: 'b',
    startDate: '2019-04-01',
    endDate: '2019-09-01'
  };

  test('when date ranges are adjacent, objects are merged', async () => {
    const data = [a1, a3];
    const result = mergeHistory(data);
    expect(result.length).to.equal(1);
    expect(result[0].startDate).to.equal('2018-04-01');
    expect(result[0].endDate).to.equal('2019-08-01');
  });

  test('when earlier date range has no end date, objects are considered adjacent and merged', async () => {
    const data = [a2, a3];
    const result = mergeHistory(data);
    expect(result.length).to.equal(1);
    expect(result[0].startDate).to.equal('2018-04-01');
    expect(result[0].endDate).to.equal('2019-08-01');
  });

  test('when date ranges are not adjacent, they are not merged', async () => {
    const data = [a1, a4];
    const result = mergeHistory(data);
    expect(result.length).to.equal(2);
    expect(result).to.equal(data);
  });

  test('adjacent but non-equal objects are not merged', async () => {
    const data = [a1, b];
    const result = mergeHistory(data);
    expect(result.length).to.equal(2);
    expect(result).to.equal(data);
  });

  test('a custom equality test can be provided', async () => {
    const data = [a1, b];
    const result = mergeHistory(data, () => true);

    expect(result.length).to.equal(1);
    expect(result[0].id).to.equal('a');
    expect(result[0].startDate).to.equal('2018-04-01');
    expect(result[0].endDate).to.equal('2019-09-01');
  });
});
