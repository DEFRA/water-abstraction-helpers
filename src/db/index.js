const pg = require('pg');

/**
 * Formats a log message if pool low on connections
 * @param {Object} pool - pg pool instance
 * @return {String} - the message to log
 */
const formatLogMessage = pool => {
  const { totalCount, idleCount, waitingCount } = pool;
  return `Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`;
};

/**
 * Determines whether to log message if pool low on connections
 * @param {Object} config - pg options
 * @param {Object} pool - pg pool instance
 * @return {Boolean} - whether to log message
 */
const isLogMessage = (config, pool) => {
  const { totalCount, idleCount, waitingCount } = pool;
  return totalCount === config.max && idleCount === 0 && waitingCount > 0;
};

/**
 * Registers event listeners on the PG pool instance
 * @param {Pool} pool
 * @param {Object} config
 * @param {Logger} logger
 */
const registerEventListeners = (pool, config, logger) => {
  pool.on('acquire', () => {
    if (isLogMessage(config, pool)) {
      logger.info(formatLogMessage(pool));
    }
  });
  pool.on('error', err => {
    logger.error('Database pool error', err);
  });
};

/**
 * Creates a Postgres pool instance
 * @param {Object} config - pg options
 * @param {Object} postgres pool instance
 */
const createPool = (config, logger) => {
  const pool = new pg.Pool(config);
  registerEventListeners(pool, config, logger);
  return pool;
};

exports.createPool = createPool;
