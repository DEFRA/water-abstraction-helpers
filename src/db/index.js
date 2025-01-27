'use strict'
const pg = require('pg')

/**
 * Formats a log message if pool low on connections
 * @param {Object} pool - pg pool instance
 * @return {String} - the message to log
 */
const formatLogMessage = pool => {
  const { totalCount, idleCount, waitingCount } = pool
  return `Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`
}

/**
 * Determines whether to log message if pool low on connections
 * @param {Object} config - pg options
 * @param {Object} pool - pg pool instance
 * @return {Boolean} - whether to log message
 */
const isLogMessage = (config, pool) => {
  const { totalCount, idleCount, waitingCount } = pool
  return totalCount === config.max && idleCount === 0 && waitingCount > 0
}

/**
 * Registers event listeners on the PG pool instance
 * @param {Pool} pool
 * @param {Object} config
 * @param {Logger} logger
 */
const registerEventListeners = (pool, _config, logger) => {
  pool.on('error', err => {
    logger.error('Database pool error', err)
  })
}

/**
 * Creates a Postgres pool instance
 * @param {Object} config - pg options
 * @param {Object} postgres pool instance
 */
const createPool = (config, logger) => {
  const pool = new pg.Pool(config)
  registerEventListeners(pool, config, logger)
  return pool
}

/**
 * Maps a query and params written for use with pg.pool
 * so that it is compatible with knex.raw.
 *
 * With pg.pool the position of the parameter in the 1-based array
 * is used, prefixed with a $ symbol, e.g.:
 * `select * from table where name=$1`, ['bob']
 *
 * With knex, named parameters and a hash is generallly used, e.g.:
 * `select * from table where name=:name`, { name : 'bob' }
 *
 * @param {String} sqlQuery - bound params are specified as $1, $2 etc.
 * @param {Array} [params] - array params
 * @return {Object} [query, params]
 */
const mapQueryToKnex = (query, params = []) => {
  if (params.length === 0) {
    return [query]
  }

  const data = params.reduce((acc, param, i) => {
    // This is the parameter name for the knex query - in knex
    // parameters are passed as a hash
    const key = `param_${i}`

    // This regex is looking for a pattern such as $4 in the query
    // as this is how bound parameters are specified in the underlying
    // pg library.
    // It is made up of:
    // \\$ a dollar symbol with the necessary escaping since $ is a special char in regex
    // ${i + 1} is the integer to search for
    // (?![0-9]) is a negative lookahead, and ensures the integer isn't followed by another integer
    // - this avoids e.g. $11 being a match when we are replacing $1
    const r = new RegExp(`\\$${i + 1}(?![0-9])`, 'g')

    return {
      params: {
        ...acc.params,
        [key]: param
      },
      query: acc.query.replace(r, `:${key}`)
    }
  }, { query, params: {} })

  return [data.query, data.params]
}

module.exports = {
  createPool,
  mapQueryToKnex
}
