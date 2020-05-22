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

  experiment('.stringNullToNull', async () => {
    test('handles null', async () => {
      expect(nald.stringNullToNull(null)).to.equal(null);
    });

    test('convert "null" to null', async () => {
      expect(nald.stringNullToNull('null')).to.equal(null);
    });

    test('ignores numbers', async () => {
      expect(nald.stringNullToNull(123)).to.equal(123);
    });

    test('leaves a string value as is', async () => {
      expect('carrots').to.equal('carrots');
    });
  });

  experiment('trimValues', () => {
    test('removes whitespace from the start and end of nested values', async () => {
      const messy = {
        one: ' one',
        two: ' two ',
        three: ' three ',
        inner: {
          four: ' four',
          five: ' five ',
          six: ' six '
        }
      };

      const tidy = nald.trimValues(messy);

      expect(tidy).to.equal({
        one: 'one',
        two: 'two',
        three: 'three',
        inner: {
          four: 'four',
          five: 'five',
          six: 'six'
        }
      });
    });
  });
});
