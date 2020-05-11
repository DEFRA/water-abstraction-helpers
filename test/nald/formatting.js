const { expect } = require('@hapi/code');
const { experiment, test } = exports.lab = require('@hapi/lab').script();

const formatting = require('../../src/nald/formatting');

experiment('nald/formatting', () => {
  experiment('.formatNGRPointString', () => {
    test('creates the expected string', async () => {
      const formatted = formatting.formatNGRPointStr('AB', '111222', '333444');
      expect(formatted).to.equal('AB 111 333');
    });
  });

  experiment('.formatAbstractionPoint', () => {
    test('returns the formatted point', async () => {
      const point = {
        LOCAL_NAME: 'A local name for local people',
        NGR1_SHEET: 'AA',
        NGR1_EAST: '111000',
        NGR1_NORTH: '222000',
        NGR2_SHEET: 'BB',
        NGR2_EAST: '333000',
        NGR2_NORTH: '444000',
        NGR3_SHEET: 'CC',
        NGR3_EAST: '555000',
        NGR3_NORTH: '666000',
        NGR4_SHEET: 'DD',
        NGR4_EAST: '777000',
        NGR4_NORTH: '888000'
      };

      const formatted = formatting.formatAbstractionPoint(point);

      expect(formatted.name).to.equal(point.LOCAL_NAME);
      expect(formatted.ngr1).to.equal('AA 111 222');
      expect(formatted.ngr2).to.equal('BB 333 444');
      expect(formatted.ngr3).to.equal('CC 555 666');
      expect(formatted.ngr4).to.equal('DD 777 888');
    });
  });

  experiment('.addressFormatter', () => {
    test('maps the expected data', async () => {
      const address = formatting.addressFormatter({
        ADDR_LINE1: 'address_line1',
        ADDR_LINE2: 'address_line2',
        ADDR_LINE3: 'address_line3',
        ADDR_LINE4: 'address_line4',
        TOWN: 'town',
        COUNTY: 'county',
        POSTCODE: 'postcode',
        COUNTRY: 'country'
      });

      expect(address).to.equal({
        addressLine1: 'address_line1',
        addressLine2: 'address_line2',
        addressLine3: 'address_line3',
        addressLine4: 'address_line4',
        town: 'town',
        county: 'county',
        postcode: 'postcode',
        country: 'country'
      });
    });
  });
});
