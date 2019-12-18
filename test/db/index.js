require('dotenv').config();
const { beforeEach, experiment, test, afterEach } =
  exports.lab = require('lab').script();
const { expect } = require('code');
const sandbox = require('sinon').createSandbox();
const db = require('../../src/db');

const config = {
  connectionString: process.env.DATABASE_URL,
  max: 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
};

experiment('db/index.js', () => {
  afterEach(async () => {
    sandbox.restore();
  });

  experiment('createPool', () => {
    let pool, logger, client;

    beforeEach(async () => {
      logger = {
        error: sandbox.stub(),
        info: sandbox.stub()
      };

      client = {};

      pool = db.createPool(config, logger);
    });

    test('pool.query can perform a query', async () => {
      const { rows } = await pool.query(`select 1 as value`);
      expect(rows[0].value).to.equal(1);
    });

    experiment('when a client is acquired', () => {
      experiment('if pool is waiting for an available client', () => {
        beforeEach(async () => {
          sandbox.stub(pool, 'waitingCount').get(() => 1);
          sandbox.stub(pool, 'totalCount').get(() => 8);
          pool.emit('acquire', client);
        });

        test('an info message is logged', async () => {
          const [msg] = logger.info.lastCall.args;
          expect(msg).to.equal('Pool low on connections::Total:8,Idle:0,Waiting:1');
        });
      });

      experiment('if pool is not waiting for an available client', () => {
        beforeEach(async () => {
          sandbox.stub(pool, 'waitingCount').get(() => 0);
          sandbox.stub(pool, 'totalCount').get(() => 8);
          pool.emit('acquire', client);
        });

        test('no messages are logged', async () => {
          expect(logger.info.called).to.be.false();
        });
      });
    });

    experiment('when a client errors', () => {
      const err = new Error('some terrible problem');

      beforeEach(async () => {
        pool.emit('error', err);
      });

      test('an error message is logged', async () => {
        const { args } = logger.error.lastCall;
        expect(args[0]).to.equal('Database pool error');
        expect(args[1]).to.equal(err);
      });
    });
  });
});
