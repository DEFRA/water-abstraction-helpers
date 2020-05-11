const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const nald = require('../../src/nald/index');

experiment('nald', () => {
  experiment('.findCurrent', () => {
    test('returns undefined if no versions ', async () => {
      const current = nald.findCurrent();
      expect(current).to.be.undefined();
    });

    test('returns undefined if no current version ', async () => {
      const current = nald.findCurrent([
        { STATUS: 'DRAFT' },
        { STATUS: 'DRAFT' }
      ]);
      expect(current).to.be.undefined();
    });

    test('returns the expected current version', async () => {
      const current = nald.findCurrent([
        { STATUS: 'DRAFT' },
        { STATUS: 'CURR', test: true }
      ]);

      expect(current).to.equal(
        { STATUS: 'CURR', test: true }
      );
    });
  });

  experiment('.transformNull', () => {
    let data;
    let transformed;

    beforeEach(async () => {
      data = {
        one: 1,
        null: null,
        text: 'testing testing',
        stringNull: 'null',
        nextLayer: {
          two: 2,
          null: null,
          text: 'testing testing',
          stringNull: 'null'
        }
      };

      transformed = nald.transformNull(data);
    });

    test('leaves the number alone', async () => {
      expect(transformed.one).to.equal(1);
      expect(transformed.nextLayer.two).to.equal(2);
    });

    test('leaves null as null', async () => {
      expect(transformed.null).to.equal(null);
      expect(transformed.nextLayer.null).to.equal(null);
    });

    test('leaves strings as strings', async () => {
      expect(transformed.text).to.equal('testing testing');
      expect(transformed.nextLayer.text).to.equal('testing testing');
    });

    test('transforms "null" to null', async () => {
      expect(transformed.stringNull).to.equal(null);
      expect(transformed.nextLayer.stringNull).to.equal(null);
    });
  });
});
