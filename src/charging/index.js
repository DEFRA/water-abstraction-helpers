const dateRangeSplitter = require('./date-range-splitter');
const billableDays = require('./billable-days');

module.exports = {
  ...dateRangeSplitter,
  ...billableDays
};
