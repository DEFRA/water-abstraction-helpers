'use strict';

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

    test('handles falsey sheet values', async () => {
      const point = {
        LOCAL_NAME: 'A local name for local people',
        NGR1_SHEET: 'AA',
        NGR1_EAST: '111000',
        NGR1_NORTH: '222000'

      };

      const formatted = formatting.formatAbstractionPoint(point);

      expect(formatted.name).to.equal(point.LOCAL_NAME);
      expect(formatted.ngr1).to.equal('AA 111 222');
      expect(formatted.ngr2).to.equal(null);
      expect(formatted.ngr3).to.equal(null);
      expect(formatted.ngr4).to.equal(null);
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

    test('trims the data', async () => {
      const address = formatting.addressFormatter({
        ADDR_LINE1: '  address_line1',
        ADDR_LINE2: 'address_line2  ',
        ADDR_LINE3: '   address_line3   ',
        ADDR_LINE4: 'address_line4',
        TOWN: 'town         ',
        COUNTY: 'county',
        POSTCODE: 'postcode',
        COUNTRY: '      country'
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

    test('convert "null" to null', async () => {
      const address = formatting.addressFormatter({
        ADDR_LINE1: 'null',
        ADDR_LINE2: 'address_line2',
        ADDR_LINE3: 'address_line3',
        ADDR_LINE4: 'null',
        TOWN: 'town',
        COUNTY: 'county',
        POSTCODE: 'postcode',
        COUNTRY: 'null'
      });

      expect(address).to.equal({
        addressLine1: null,
        addressLine2: 'address_line2',
        addressLine3: 'address_line3',
        addressLine4: null,
        town: 'town',
        county: 'county',
        postcode: 'postcode',
        country: null
      });
    });
  });

  experiment('.nameFormatter', () => {
    experiment('when the party is a person', () => {
      experiment('and the party has all the name parts', () => {
        test('the expected contact object is returned', async () => {
          const party = {
            APAR_TYPE: 'PER',
            SALUTATION: 'Mr',
            INITIALS: 'P',
            NAME: 'Tay'
          };

          const person = formatting.nameFormatter(party);

          expect(person).to.equal({
            contactType: 'Person',
            name: 'Mr P Tay'
          });
        });
      });

      experiment('and the party has some of name parts', () => {
        test('the expected contact object is returned', async () => {
          const party = {
            APAR_TYPE: 'PER',
            SALUTATION: 'Mr',
            NAME: 'Tay'
          };

          const person = formatting.nameFormatter(party);

          expect(person).to.equal({
            contactType: 'Person',
            name: 'Mr Tay'
          });
        });
      });

      test('trims the data returned', async () => {
        const party = {
          APAR_TYPE: 'PER',
          SALUTATION: 'Mr ',
          INITIALS: ' P ',
          NAME: ' Tay'
        };

        const person = formatting.nameFormatter(party);

        expect(person).to.equal({
          contactType: 'Person',
          name: 'Mr P Tay'
        });
      });

      test('removes "null" data', async () => {
        const party = {
          APAR_TYPE: 'PER',
          SALUTATION: 'Mr',
          INITIALS: 'null',
          NAME: 'Tay'
        };

        const person = formatting.nameFormatter(party);

        expect(person).to.equal({
          contactType: 'Person',
          name: 'Mr Tay'
        });
      });
    });

    experiment('when the party is an organisation', () => {
      test('the expected contact object is returned', async () => {
        const party = {
          APAR_TYPE: 'ORG',
          NAME: 'Hopping Carrot Farm'
        };

        const organisation = formatting.nameFormatter(party);

        expect(organisation).to.equal({
          contactType: 'Organisation',
          name: 'Hopping Carrot Farm'
        });
      });
    });

    test('trims the data returned', async () => {
      const party = {
        APAR_TYPE: 'ORG',
        NAME: '  Hopping Carrot Farm   '
      };

      const organisation = formatting.nameFormatter(party);

      expect(organisation).to.equal({
        contactType: 'Organisation',
        name: 'Hopping Carrot Farm'
      });
    });
  });

  experiment('.crmNameFormatter', () => {
    test('extracts the expected data', async () => {
      const party = {
        APAR_TYPE: 'PER',
        SALUTATION: 'Miss',
        INITIALS: 'P',
        FORENAME: 'Par',
        NAME: 'Tay'
      };

      const person = formatting.crmNameFormatter(party);

      expect(person).to.equal({
        type: 'Person',
        salutation: 'Miss',
        forename: 'Par',
        initials: 'P',
        name: 'Tay'
      });
    });

    test('trims the data', async () => {
      const party = {
        APAR_TYPE: 'PER',
        SALUTATION: ' Miss',
        INITIALS: 'P ',
        FORENAME: 'Par',
        NAME: '  Tay  '
      };

      const person = formatting.crmNameFormatter(party);

      expect(person).to.equal({
        type: 'Person',
        salutation: 'Miss',
        forename: 'Par',
        initials: 'P',
        name: 'Tay'
      });
    });

    test('converts "null" to null', async () => {
      const party = {
        APAR_TYPE: 'PER',
        SALUTATION: 'Miss',
        INITIALS: 'P',
        FORENAME: 'null',
        NAME: 'Tay'
      };

      const person = formatting.crmNameFormatter(party);

      expect(person).to.equal({
        type: 'Person',
        salutation: 'Miss',
        forename: null,
        initials: 'P',
        name: 'Tay'
      });
    });
  });
});
