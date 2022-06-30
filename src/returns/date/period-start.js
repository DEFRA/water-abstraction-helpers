const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

/**
 * Given a particular date and a isSummer flag, calculates the start date
 * of the returns cycle that date lies in
 * @param {String} date - comparison date
 * @param {Boolean} isSummer - whether summer return
 * @return {String} YYYY-MM-DD next period start date
 */
const getPeriodStart = (date, isSummer) => {
  const m = moment(date)
  const month = isSummer ? 10 : 3
  const comparison = moment().year(m.year()).month(month).date(1)
  const startYear = m.isBefore(comparison, 'day') ? m.year() - 1 : m.year()
  return moment().year(startYear).month(month).date(1).format(dateFormat)
}

module.exports = {
  getPeriodStart
}
