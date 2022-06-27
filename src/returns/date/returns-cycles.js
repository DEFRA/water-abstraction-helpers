'use strict'

const { cloneDeep } = require('lodash')
const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

/**
 * Gets due date based on cycle end date
 * @param {String} endDate
 * @return {String}
 */
const getDueDate = endDate =>
  endDate === '2020-03-31' ? '2020-10-16' : moment(endDate).add(28, 'day').format(dateFormat)

const cycleFactory = (startDate, isSummer = false) => {
  const endDate = moment(startDate).add(1, 'year').subtract(1, 'day').format(dateFormat)
  return {
    startDate: moment(startDate).format(dateFormat),
    endDate,
    isSummer,
    dueDate: getDueDate(endDate)
  }
}

/**
 * Gets the start date of the next returns cycle, given a date.
 * @param  {String} date - start  [description]
 * @return {Object}            - an object containing the start/end date and isSummer flag
 */
const getNextCycle = (date) => {
  const m = moment(date)
  const winter = `${m.year()}-04-01`
  const summer = `${m.year()}-11-01`

  if (m.isSameOrBefore(winter, 'day')) {
    return cycleFactory(winter, false)
  } else if (m.isSameOrBefore(summer, 'day')) {
    return cycleFactory(summer, true)
  } else {
    return cycleFactory(`${m.year() + 1}-04-01`, false)
  }
}

/**
 * Calculates return cycles that lie between the specified start and end dates.
 * End date defaults to current date, start date defaults to that of the first
 * return cycle captured by the service - 1 Nov 2017
 */
const createReturnCycles = (startDate = '2017-11-01', endDate) => {
  const end = moment(endDate)

  if (end.isBefore(startDate, 'day')) {
    throw new Error(`createReturnCycles - invalid date range ${startDate}-${endDate}`)
  }

  let cycle = getNextCycle(startDate)

  const cycles = []

  while (moment(cycle.endDate).isSameOrBefore(end, 'day')) {
    cycles.push(cloneDeep(cycle))
    cycle = getNextCycle(moment(cycle.startDate).add(1, 'day'))
  }
  return cycles
}

module.exports = {
  createReturnCycles
}
