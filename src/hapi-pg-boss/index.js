'use strict';

/**
 * Create message queue and register as server.messageQueue
 * @see {@link https://github.com/timgit/pg-boss/blob/master/docs/usage.md#start}
 */
const register = async (server, options) => {
  const PgBoss = require('pg-boss');
  const boss = new PgBoss(options);
  server.decorate('server', 'messageQueue', boss);
  server.decorate('request', 'messageQueue', boss);
  return boss.start();
};

module.exports = {
  name: 'pgBoss',
  register
};
