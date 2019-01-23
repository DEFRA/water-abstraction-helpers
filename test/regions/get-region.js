const Lab = require('lab');

const lab = Lab.script();
const { expect } = require('code');

const { regions: { getRegion } } = require('../../src');

lab.experiment('getRegion', () => {
  lab.test('It should return a region when passed a numeric region code', async () => {
    expect(getRegion(1)).to.equal('Anglian');
  });

  lab.test('It should return a region when passed a string region code', async () => {
    expect(getRegion('8')).to.equal('Wales');
  });

  lab.test('It should return undefined for an invalid region', async () => {
    expect(getRegion(9)).to.equal(undefined);
  });
});

exports.lab = lab;
