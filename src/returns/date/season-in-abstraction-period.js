'use-strict';

const moment = require('moment');
const summer = {
  startDay: '01',
  startMonth: '04',
  endDay: '31',
  endMonth: '10'
};

const winter = {
  startDay: '01',
  startMonth: '11',
  endDay: '31',
  endMonth: '03'
};

const CHARGE_SEASON = {
  summer: 'summer',
  winter: 'winter',
  allYear: 'all year'
};

const createRange = (abstractionPeriod, startYear) => {
  const { startDay, endDay, startMonth, endMonth } = abstractionPeriod;
  const isCrossYear = (startMonth > endMonth || (startMonth === endMonth && startDay > endDay));
  const endYear = isCrossYear ? startYear + 1 : startYear;

  const mStart = moment({
    year: startYear,
    month: startMonth - 1,
    date: startDay
  });

  const mEnd = moment({
    year: endYear,
    month: endMonth - 1,
    date: endDay
  });

  return moment.range(mStart, mEnd);
};

/**
   * Checks if the passed AbstractionPeriod contains this instance. In order
   * for this to return true, this instance must fit inside the passed
   * AbstractionPeriod, including the boundaries.
   *
   * @param {Object} abstractionPeriod should contain a startDay, startMonth, endDay and endMonth
   * @param {Object} period should contain a startDay, startMonth, endDay and endMonth
   */
const isWithinAbstractionPeriod = (abstractionPeriod, period) => {
  const abstractionRange = createRange(abstractionPeriod, 2018);
  const testRanges = [createRange(period, 2017), createRange(period, 2018)];
  return testRanges.some(range => range.contains(abstractionRange));
};

/**
   * Gets a default charge season for the defined abstraction period.
   *
   * This is a starting point in some cases where additional logic (TPT etc)
   * will need to be overlayed.
   */
const getAbstractionPeriodSeason = (abstractionPeriod) => {
  // For the season to be summer, this abstraction period must
  // sit within the summer period (01/04 - 31/10)
  if (isWithinAbstractionPeriod(abstractionPeriod, summer)) {
    return CHARGE_SEASON.summer;
  }

  // For the season to be winter, this abstraction period must
  // sit within the winter period (01/11 - 31/03)
  if (this.isWithinAbstractionPeriod(abstractionPeriod, winter)) {
    return CHARGE_SEASON.winter;
  }

  return CHARGE_SEASON.allYear;
};

exports.isWithinAbstractionPeriod = isWithinAbstractionPeriod;
exports.getAbstractionPeriodSeason = getAbstractionPeriodSeason;
