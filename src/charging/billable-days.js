'use strict';

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

const DATE_FORMAT = 'YYYY-MM-DD';

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
 * Given a day and month, and a financial year,
 * returns the actual date as a moment
 * @param {Number} day
 * @param {Number} month (1-12)
 * @param {Number} financialYear
 * @return {Object} moment object
 */
const getFinancialYearDate = (day, month, financialYear) => {
  const year = month < 4 ? financialYear : financialYear - 1;
  return moment(`${day}-${month}-${year}`, 'D-M-YYYY').format('YYYY-MM-DD');
};

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
  return moment(endDate).diff(startDate, 'days') + 1;
};

/**
 * Gets the intersecting date range between the supplied ranges
 * @param {Array} ranges - e.g. [[startDate, endDate], []...]
 * @returns {Array|null}
 */
const getIntersection = ranges => {
  const startDate = ranges.map(range => range[0]).sort().pop();
  const endDate = ranges.map(range => range[1]).sort()[0];
  return moment(startDate).isAfter(endDate, 'day')
    ? null
    : [startDate, endDate];
};

const formatDate = str => moment(str).format(DATE_FORMAT);

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
  const financialYear = getFinancialYear(endDate);

  const absStart = getFinancialYearDate(absPeriod.startDay, absPeriod.startMonth, financialYear);
  const absEnd = getFinancialYearDate(absPeriod.endDay, absPeriod.endMonth, financialYear);

  // Create time ranges for the abs period
  const absPeriodRanges = moment(absEnd).isBefore(absStart, 'day')
    ? [[startDate, absEnd], [absStart, endDate]]
    : [[absStart, absEnd]];

  // Create time range for the billing period
  const billingPeriod = [
    formatDate(startDate),
    formatDate(endDate)
  ];

  return absPeriodRanges.reduce((acc, range) => {
    const intersection = getIntersection([range, billingPeriod]);

    return acc + (
      intersection ? moment(intersection[1]).diff(intersection[0], 'day') + 1 : 0
    );
  }, 0);
};

exports.getFinancialYear = getFinancialYear;
exports.getFinancialYearDate = getFinancialYearDate;
exports.getTotalDays = getTotalDays;
exports.getBillableDays = getBillableDays;
exports.getIntersection = getIntersection;
