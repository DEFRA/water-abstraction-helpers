'use strict'

const { experiment, test } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const { returns: { date: { isWithinAbstractionPeriod, getAbstractionPeriodSeason } } } = require('../../../src')

const CHARGE_SEASON = {
  summer: 'summer',
  winter: 'winter',
  allYear: 'all year'
}
const getPeriod = (startDay, startMonth, endDay, endMonth) => { return { startDay, startMonth, endDay, endMonth } }

experiment('.getAbstractionPeriodSeason()', () => {
  experiment('when the period matches the summer period', () => {
    test('the season is all year', async () => {
      const period = getPeriod('01', '04', '31', '10')
      expect(getAbstractionPeriodSeason(period)).to.equal(CHARGE_SEASON.summer)
    })
  })

  experiment('when the period matches the winter period', () => {
    test('the season is all year', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      expect(getAbstractionPeriodSeason(winter)).to.equal(CHARGE_SEASON.winter)
    })
  })

  experiment('when the period is within the summer period', () => {
    test('the season is summer', async () => {
      const april = getPeriod(2, 4, 30, 4)
      expect(getAbstractionPeriodSeason(april)).to.equal(CHARGE_SEASON.summer)

      const october = getPeriod(2, 10, 25, 10)
      expect(getAbstractionPeriodSeason(october)).to.equal(CHARGE_SEASON.summer)
    })
  })

  experiment('when the period is within the winter period', () => {
    test('the season is winter', async () => {
      const november = getPeriod(2, 11, 30, 11)
      expect(getAbstractionPeriodSeason(november)).to.equal(CHARGE_SEASON.winter)

      const march = getPeriod(2, 3, 25, 3)
      expect(getAbstractionPeriodSeason(march)).to.equal(CHARGE_SEASON.winter)

      const xmasHols = getPeriod(20, 12, 4, 1)
      expect(getAbstractionPeriodSeason(xmasHols)).to.equal(CHARGE_SEASON.winter)
    })
  })
  experiment('when the period is streaches into summer and winter', () => {
    test('the season is all year', async () => {
      const aprToMar = getPeriod(1, 4, 31, 3)
      expect(getAbstractionPeriodSeason(aprToMar)).to.equal(CHARGE_SEASON.allYear)
      // winter boundary
      const aprToNov = getPeriod(1, 4, 2, 11)
      expect(getAbstractionPeriodSeason(aprToNov)).to.equal(CHARGE_SEASON.allYear)
      // summer boundary
      const octToMar = getPeriod(1, 10, 31, 3)
      expect(getAbstractionPeriodSeason(octToMar)).to.equal(CHARGE_SEASON.allYear)
      // winter and summer boundary
      const octToNov = getPeriod(1, 10, 1, 11)
      expect(getAbstractionPeriodSeason(octToNov)).to.equal(CHARGE_SEASON.allYear)
    })
  })
})

experiment('.isWithinAbstractionPeriod', () => {
  experiment('when the abstraction period is in the same year', () => {
    test('returns true if the start dates are the same', async () => {
      const summer = getPeriod(1, 4, 31, 10)
      const period = getPeriod(1, 4, 1, 10)
      expect(isWithinAbstractionPeriod(period, summer)).to.equal(true)
    })

    test('returns true if the end dates are the same', async () => {
      const summer = getPeriod(1, 4, 31, 10)
      const period = getPeriod(1, 5, 31, 10)
      expect(isWithinAbstractionPeriod(period, summer)).to.equal(true)
    })

    test('returns true if both start and end dates are the same', async () => {
      const summer = getPeriod(1, 4, 31, 10)
      const period = getPeriod(1, 4, 31, 10)
      expect(isWithinAbstractionPeriod(period, summer)).to.equal(true)
    })

    test('returns true if both dates are in between the period', async () => {
      const summer = getPeriod(1, 4, 31, 10)
      const period = getPeriod(1, 5, 1, 6)
      expect(isWithinAbstractionPeriod(period, summer)).to.equal(true)
    })

    test('return false if the start date is before the range', async () => {
      const summer = getPeriod(1, 4, 31, 10)
      const beforeSummer = getPeriod(1, 3, 31, 10)
      expect(isWithinAbstractionPeriod(beforeSummer, summer)).to.equal(false)
    })

    test('return false if the end date is after the range', async () => {
      const summer = getPeriod(1, 4, 31, 10)
      const afterSummer = getPeriod(1, 4, 31, 11)
      expect(isWithinAbstractionPeriod(afterSummer, summer)).to.equal(false)
    })

    test('return false if the start and end dates are outside the range', async () => {
      const summer = getPeriod(1, 4, 31, 10)
      const notSummer = getPeriod(1, 3, 31, 11)
      expect(isWithinAbstractionPeriod(notSummer, summer)).to.equal(false)
    })
  })

  experiment('when the abstraction period spans two years', () => {
    test('returns true if the start dates are the same', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      const period = getPeriod(1, 11, 1, 3)
      expect(isWithinAbstractionPeriod(period, winter)).to.equal(true)
    })

    test('returns true if the end dates are the same', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      const period = getPeriod(1, 2, 31, 3)
      expect(isWithinAbstractionPeriod(period, winter)).to.equal(true)
    })

    test('returns true if both start and end dates are the same', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      const period = getPeriod(1, 11, 31, 3)
      expect(isWithinAbstractionPeriod(period, winter)).to.equal(true)
    })

    test('returns true if both dates are in between the period', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      const period = getPeriod(1, 12, 1, 3)
      expect(isWithinAbstractionPeriod(period, winter)).to.equal(true)
    })

    test('return false if the start date is before the range', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      const beforewinter = getPeriod(1, 10, 31, 3)
      expect(isWithinAbstractionPeriod(beforewinter, winter)).to.equal(false)
    })

    test('return false if the end date is after the range', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      const afterSummer = getPeriod(1, 11, 31, 4)
      expect(isWithinAbstractionPeriod(afterSummer, winter)).to.equal(false)
    })

    test('return false if the start and end dates are outside the range', async () => {
      const winter = getPeriod(1, 11, 31, 3)
      const notWinter = getPeriod(1, 10, 31, 4)
      expect(isWithinAbstractionPeriod(notWinter, winter)).to.equal(false)
    })
  })
})
