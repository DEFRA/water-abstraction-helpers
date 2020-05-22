const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const { cloneDeep, uniq } = require('lodash');

const DATE_FORMAT = 'YYYY-MM-DD';

const getStartDate = obj =>
  obj.startDate || obj.start_date || null;

const getEndDate = obj =>
  obj.endDate || obj.end_date || null;

const getNextDay = date =>
  moment(date).add(1, 'day').format(DATE_FORMAT);

const getPreviousDay = date =>
  moment(date).subtract(1, 'day').format(DATE_FORMAT);

/**
 * Get a unique list of start dates where splits occur in order
 * @param {Object} objA
 * @param {Array} listB
 * @return {Array<String>} list of dates in YYYY-MM-DD format
 */
const getSplitDates = (objA, listB) => {
  const range = moment.range(getStartDate(objA), getEndDate(objA));
  const predicate = date => date && range.contains(moment(date));
  const startDates = listB.reduce((acc, objB) => {
    const endDate = getEndDate(objB);

    const splitDates = [
      getStartDate(objB),
      endDate ? getNextDay(endDate) : null
    ];

    return uniq([
      ...acc,
      ...splitDates.filter(predicate)
    ]);
  }, [getStartDate(objA)]);

  return startDates.sort();
};

const createRangeList = arr => arr.map(obj => ({
  obj,
  range: moment.range(getStartDate(obj), getEndDate(obj))
}));

const findOverlapping = (arrWithRanges, startDate, endDate) => {
  const range = moment.range(startDate, endDate);
  const item = arrWithRanges.find(item => range.overlaps(item.range));
  return item ? item.obj : null;
};

/**
 * Splits an object with a date range into an array of objects with
 * contiguous date ranges, split by the date ranges in the provided list
 *
 * This is useful for example when we have a charge version for a financial
 * year, and wish to split it by invoice accounts or agreements
 * into a number of separate date-based configurations.
 *
 * @param {Object} objA
 * @param {String} objA.startDate - start date YYYY-MM-DD
 * @param {String} objA.endDate - end date YYYY-MM-DD
 * @param {Array} arr - list of objects with date properties as objA
 * @param {String} propertyName - property to set in the return objects
 * @return {Array}
 */
const dateRangeSplitter = (objA, arr = [], propertyName) => {
  const endDate = getEndDate(objA);
  const startDates = getSplitDates(objA, arr);
  const arrWithRanges = createRangeList(arr);

  return startDates.map((startDate, i) => {
    const effectiveEndDate = (i === startDates.length - 1) ? endDate : getPreviousDay(startDates[i + 1]);
    return {
      ...cloneDeep(objA),
      effectiveStartDate: startDate,
      effectiveEndDate,
      [propertyName]: findOverlapping(arrWithRanges, startDate, effectiveEndDate)
    };
  });
};

exports.dateRangeSplitter = dateRangeSplitter;
