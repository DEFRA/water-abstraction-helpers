'use strict';
const pg = require('pg');

const formatLogMessage = pool => {
  const { totalCount, idleCount, waitingCount } = pool;
  return `Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`;
};

const isLogMessage = (config, pool) => {
  const { totalCount, idleCount, waitingCount } = pool;
  return totalCount === config.max && idleCount === 0 && waitingCount > 0;
};

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

const createPool = (config, logger) => {
  const pool = new pg.Pool(config);
  registerEventListeners(pool, config, logger);
  return pool;
};

const mapQueryToKnex = (query, params = []) => {
  if (params.length === 0) {
    return [query];
  }

  const data = params.reduce((acc, param, i) => {
    // This is the parameter name for the knex query - in knex
    // parameters are passed as a hash
    const key = `param_${i}`;

    // This regex is looking for a pattern such as $4 in the query
    // as this is how bound parameters are specified in the underlying
    // pg library.
    // It is made up of:
    // \\$ a dollar symbol with the necessary escaping since $ is a special char in regex
    // ${i + 1} is the integer to search for
    // (?![0-9]) is a negative lookahead, and ensures the integer isn't followed by another integer
    // - this avoids e.g. $11 being a match when we are replacing $1
    const r = new RegExp(`\\$${i + 1}(?![0-9])`, 'g');

    return {
      params: {
        ...acc.params,
        [key]: param
      },
      query: acc.query.replace(r, `:${key}`)
    };
  }, { query, params: {} });

  return [data.query, data.params];
};

module.exports = {
  createPool,
  mapQueryToKnex
};
