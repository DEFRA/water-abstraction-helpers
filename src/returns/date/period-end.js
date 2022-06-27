const moment = require('moment')
const { getPeriodStart } = require('./period-start')

/**
 * Given a particular date and a isSummer flag, calculates the end date
 * of the returns cycle that date lies in
 * @param {String} date - comparison date
 * @param {Boolean} isSummer - whether summer return
 * @return {String} YYYY-MM-DD period end date
 */
const getPeriodEnd = (date, isSummer) => {
  const startDate = getPeriodStart(date, isSummer)
  return moment(startDate)
    .add(1, 'year')
    .subtract(1, 'day')
    .format('YYYY-MM-DD')
}

module.exports = {
  getPeriodEnd
}
