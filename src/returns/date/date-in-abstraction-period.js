'use strict';

const moment = require('moment');
const Joi = require('@hapi/joi');

const VALID_DAY = Joi.number().integer().min(1).max(31).required();
const VALID_MONTH = Joi.number().integer().min(1).max(12).required();

const abstractionPeriodSchema = {
  periodEndDay: VALID_DAY,
  periodEndMonth: VALID_MONTH,
  periodStartDay: VALID_DAY,
  periodStartMonth: VALID_MONTH
};

/**
 * Checks whether a supplied day/month is the same or after a reference day/month
 * @param {Number} day - the day to test
 * @param {Number} month - the month to test
 * @param {Number} refDay - the reference day
 * @param {Number} refMonth - the reference month
 * @return {Boolean}
 */
const isSameOrAfter = (day, month, refDay, refMonth) => {
  if (month > refMonth) {
    return true;
  }
  return ((month === refMonth) && (day >= refDay));
};

/**
 * Checks whether a supplied day/month is the same or before a reference day/month
 * @param {Number} day - the day to test
 * @param {Number} month - the month to test
 * @param {Number} refDay - the reference day
 * @param {Number} refMonth - the reference month
 * @return {Boolean}
 */
const isSameOrBefore = (day, month, refDay, refMonth) => {
  if (month < refMonth) {
    return true;
  }
  return (month === refMonth) && (day <= refDay);
};

/**
 * Validates the supplied abstraction period.  If properties are strings, converts them
 * to integers.
 * Throws an error if the abstraction period is invalid
 * @param {Object} abstractionPeriod
 * @param {Number|String} options.periodStartDay - abstraction period start day of the month
 * @param {Number|String} options.periodStartMonth - abstraction period start month
 * @param {Number|String} options.periodEndDay - abstraction period end day of the month
 * @param {Number|String} options.periodEndMonth - abstraction period end month
 * @return {Object} abstractionPeriod - any strings are converted to integers
 */
const validateAbstractionPeriod = abstractionPeriod => {
  const { error, value } = Joi.validate(abstractionPeriod, abstractionPeriodSchema);
  if (error) {
    throw new Error('Invalid abstraction period - ', JSON.stringify(abstractionPeriod));
  }
  return value;
};

/**
 * Checks whether the specified date is within the abstraction period
 * @param {String} date - the date to test, format YYYY-MM-DD
 * @param {Object} options - abstraction period
 * @param {Number} options.periodStartDay - abstraction period start day of the month
 * @param {Number} options.periodStartMonth - abstraction period start month
 * @param {Number} options.periodEndDay - abstraction period end day of the month
 * @param {Number} options.periodEndMonth - abstraction period end month
 * @return {Boolean} whether supplied date is within abstraction period
 */
const isDateWithinAbstractionPeriod = (date, options) => {
  const {
    periodEndDay,
    periodEndMonth,
    periodStartDay,
    periodStartMonth
  } = validateAbstractionPeriod(options);

  // Month and day of test date
  const month = moment(date).month() + 1;
  const day = moment(date).date();

  // Period start date is >= period end date
  if (isSameOrAfter(periodEndDay, periodEndMonth, periodStartDay, periodStartMonth)) {
    return isSameOrAfter(day, month, periodStartDay, periodStartMonth) &&
      isSameOrBefore(day, month, periodEndDay, periodEndMonth);
  } else {
    const prevYear = isSameOrAfter(day, month, 1, 1) &&
      isSameOrBefore(day, month, periodEndDay, periodEndMonth);

    const thisYear = isSameOrAfter(day, month, periodStartDay, periodStartMonth) &&
      isSameOrBefore(day, month, 31, 12);

    return prevYear || thisYear;
  }
};

exports.isDateWithinAbstractionPeriod = isDateWithinAbstractionPeriod;
