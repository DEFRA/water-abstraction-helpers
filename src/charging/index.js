const dateRangeSplitter = require('./date-range-splitter');
const billableDays = require('./billable-days');
const mergeHistory = require('./merge-history');

module.exports = {
  ...dateRangeSplitter,
  ...billableDays,
  ...mergeHistory
};
