const moment = require('moment')

const withNaldLocale = date => moment(date).locale('en')
const getFirstDayOfWeek = day => withNaldLocale(day).startOf('week')
const getLastDayOfWeek = day => withNaldLocale(day).endOf('week')

/**
 * Gets the start and end days of a week relative to the passed day
 * in NALD terms, where the week is deemed to start on a sunday, and
 * end on the saturday.
 */
const getWeek = day => {
  return {
    start: getFirstDayOfWeek(day),
    end: getLastDayOfWeek(day)
  }
}

/**
 * General UK date formatter
 * @param {String} str - NALD date string, can be 'null', format dd/mm/yyyy
 * @param {String} outputFormat - output date format
 * @param {String} inputFormat - optional input format
 * @return {String} - date in new format
 */
const dateFormatter = (str, inputFormat, outputFormat) => {
  const d = moment(str, inputFormat)
  return d.isValid() ? d.format(outputFormat) : null
}

/**
 * Formats a UK date from NALD data to sortable date
 * e.g. 31/01/2018 becomes 20180131
 * @param {String} str - NALD date string, can be 'null'
 * @return {String} date in sortable date format
 */
const calendarToSortable = str => dateFormatter(str, 'DD/MM/YYYY', 'YYYYMMDD')

/**
 * Formats a UK date from NALD data to a SQL style ISO date
 * e.g. 31/01/2018 becomes 2018-01-31
 * @param {String} str - NALD date string, can be 'null'
 * @return {String} date in SQL format
 */
const calendarToIso = str => dateFormatter(str, 'DD/MM/YYYY', 'YYYY-MM-DD')

/**
 * Formats returns date in form YYYYMMDDHHmmSS to ISO YYYY-MM-DD
 * @param {String} date from NALD returns line
 * @return {String} ISO date YYYY-MM-DD
 */
const returnsToIso = str => dateFormatter(str, 'YYYYMMDD', 'YYYY-MM-DD')

/**
 * Converts date to GDS pattern of 1 November 2018
 * @param  {String} str  date in format YYYY-MM-DD
 * @return {String}     date in format 1 November 2018
 */
const isoToReadable = str => dateFormatter(str, 'YYYY-MM-DD', 'D MMMM YYYY')

exports.calendarToIso = calendarToIso
exports.calendarToSortable = calendarToSortable
exports.getWeek = getWeek
exports.isoToReadable = isoToReadable
exports.returnsToIso = returnsToIso
