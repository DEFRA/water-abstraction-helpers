const Joi = require('joi');
const moment = require('moment');

const MONTH_SCHEMA = Joi.number().integer().min(1).max(12).required();
const DAY_SCHEMA = Joi.number().integer().min(1).max(31).required();

const ABS_PERIOD_SCHEMA = Joi.object({
  startMonth: MONTH_SCHEMA,
  startDay: DAY_SCHEMA,
  endMonth: MONTH_SCHEMA,
  endDay: DAY_SCHEMA
});

const DATE_SCHEMA = Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);

/**
 * Given a date, calculates the financial year ending
 * E.g. for 2019/2020, returns 2020
 * @param {String} date
 * @return {Number} year
 */
const getFinancialYear = date => {
  const m = moment(date);
  return m.month() < 3 ? m.year() : m.year() + 1;
};

/**
 * Given an abstraction period day and month, and a financial year,
 * returns the actual date as a moment
 * @param {Number} day
 * @param {Number} month
 * @param {Number} financialYear
 * @return {Object} moment object
 */
const getAbsPeriodDate = (day, month, financialYear) => {
  const year = month < 3 ? financialYear : financialYear - 1;
  return moment(`${day}-${month}-${year}`, 'D-M-YYYY');
};

/**
 * Limits a number to a minimum possible value of 0
 * @param {Number} num
 * @return {Number}
 */
const positive = num => num < 0 ? 0 : num;

/**
 * Gets the difference in billable days between the two dates in the provided array
 * @param {Array} arr
 * @return {Number}
 */
const diffDays = arr => positive(1 + moment(arr[1]).diff(arr[0], 'days'));

/**
 * Gets the total days in the financial year
 * @param {String} startDate - YYYY-MM-DD
 * @param {String} endDate YYYY-MM-DD
 * @return {Number}
 */
const getTotalDays = (startDate, endDate) => {
  // Validate inputs
  Joi.assert(startDate, DATE_SCHEMA);
  Joi.assert(endDate, DATE_SCHEMA);

  return positive(1 + moment(endDate).diff(startDate, 'days'));
};

/**
 * Limits date so it is not before the min date and
 * not after the max date
 * @param {String} date - YYYY-MM-DD
 * @param {String} minDate - YYYY-MM-DD
 * @param {String} maxDate - YYYY-MM-DD
 * @return {String} YYYY-MM-DD
 */
const limitDate = (date, minDate, maxDate) => {
  if (moment(date).isBefore(minDate, 'day')) {
    return minDate;
  }
  if (moment(date).isAfter(maxDate, 'day')) {
    return maxDate;
  }
  return date;
};

const mapRange = (range, startDate, endDate) =>
  range.map(value => limitDate(value, startDate, endDate));

const isValidRange = ([startDate, endDate]) =>
  moment(startDate).isSameOrBefore(endDate, 'day');

const createDateRanges = (startDate, endDate, absStart, absEnd) => {
  const dateRanges = moment(absEnd).isBefore(absStart, 'day')
    ? [ [startDate, absEnd], [absStart, endDate] ]
    : [ [ absStart, absEnd ] ];

  return dateRanges.filter(isValidRange).map(range =>
    mapRange(range, startDate, endDate)
  );
};

/**
 * Gets the number of billable days between the start and end date,
 * when the abstraction period is taken into account
 * @param {Object} absPeriod - the abstraction period start/end day/month
 * @param {String} startDate - start of the billing period
 * @param {String} endDate - end of the billing period
 */
const getBillableDays = (absPeriod, startDate, endDate) => {
  // Validate inputs
  Joi.assert(absPeriod, ABS_PERIOD_SCHEMA);
  Joi.assert(startDate, DATE_SCHEMA);
  Joi.assert(endDate, DATE_SCHEMA);

  // Calculate important dates
  const financialYear = getFinancialYear(startDate);

  const absStart = getAbsPeriodDate(absPeriod.startDay, absPeriod.startMonth, financialYear);
  const absEnd = getAbsPeriodDate(absPeriod.endDay, absPeriod.endMonth, financialYear);

  // Create date ranges
  const dateRanges = createDateRanges(startDate, endDate, absStart, absEnd);

  // Return billable days
  return dateRanges.reduce((acc, range) => acc + diffDays(range), 0);
};

exports.getTotalDays = getTotalDays;
exports.getBillableDays = getBillableDays;
