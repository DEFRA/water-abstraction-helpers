const moment = require('moment')
const naldDates = require('../nald/dates')

const formatMoment = date => date.format('YYYY-MM-DD')

const isLastDayOfMonth = endDate => moment(endDate).isSame(moment(endDate).endOf('month'), 'day')

/**
 * Get required daily return lines
 * @param {String} startDate - YYYY-MM-DD start date of return cycle
 * @param {String} endDate - YYYY-MM-DD end date of return cycle
 * @return {Array} list of required return lines
 */
const getDays = (startDate, endDate) => {
  const datePtr = moment(startDate)
  const lines = []
  do {
    lines.push({
      startDate: formatMoment(datePtr),
      endDate: formatMoment(datePtr),
      timePeriod: 'day'
    })
    datePtr.add(1, 'day')
  }
  while (datePtr.isSameOrBefore(endDate, 'day'))

  return lines
}

/**
 * Get required weekly return lines
 * @param {String} startDate - YYYY-MM-DD start date of return cycle
 * @param {String} endDate - YYYY-MM-DD end date of return cycle
 * @return {Array} list of required return lines
 */
const getWeeks = (startDate, endDate) => {
  let datePtr = naldDates.getWeek(startDate)
  const lines = []

  do {
    lines.push({
      startDate: formatMoment(datePtr.start),
      endDate: formatMoment(datePtr.end),
      timePeriod: 'week'
    })
    datePtr = naldDates.getWeek(datePtr.start.add(1, 'week'))
  }
  while (datePtr.end.isSameOrBefore(endDate, 'day'))

  return lines
}

/**
 * Get required monthly return lines
 * @param {String} startDate - YYYY-MM-DD start date of return cycle
 * @param {String} endDate - YYYY-MM-DD end date of return cycle
 * @param {Boolean} isFinalReturn if return is for a partial period (split log)
 * @return {Array} list of required return lines
 */
const getMonths = (startDate, endDate, isFinalReturn) => {
  const method = isFinalReturn && !isLastDayOfMonth(endDate) ? 'isBefore' : 'isSameOrBefore'
  const datePtr = moment(startDate)
  const lines = []
  do {
    lines.push({
      startDate: formatMoment(datePtr.startOf('month')),
      endDate: formatMoment(datePtr.endOf('month')),
      timePeriod: 'month'
    })
    datePtr.add(1, 'month')
  }
  while (datePtr[method](endDate, 'month'))
  return lines
}

/**
 * Get required annual return lines
 * @param {String} startDate - YYYY-MM-DD start date of return cycle
 * @param {String} endDate - YYYY-MM-DD end date of return cycle
 * @return {Array} list of required return lines
 */
const getYears = (startDate, endDate) => {
  return [{
    startDate,
    endDate,
    timePeriod: 'year'
  }]
}

/**
 * Calculates lines required in return
 * @param {String} startDate - YYYY-MM-DD
 * @param {String} endDate - YYYY-MM-DD
 * @param {String} frequency
 * @param {Boolean} isFinalReturn - split logs
 * @return {Array} array of required lines
 */
const getRequiredLines = (startDate, endDate, frequency, isFinalReturn) => {
  const map = {
    day: getDays,
    week: getWeeks,
    month: getMonths,
    year: getYears
  }

  if (map[frequency]) {
    return map[frequency](startDate, endDate, isFinalReturn)
  }

  throw new Error(`Unknown frequency ${frequency}`)
}

exports.getDays = getDays
exports.getWeeks = getWeeks
exports.getMonths = getMonths
exports.getYears = getYears
exports.getRequiredLines = getRequiredLines
