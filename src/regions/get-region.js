/**
 * Gets the name of a region given the NALD region code
 * @param  {String|Number} regionCode - NALD region code 1-8
 * @return {String}        region name
 */
const getRegion = (regionCode) => {
  const codes = {
    1: 'Anglian',
    2: 'Midlands',
    3: 'North east',
    4: 'North west',
    5: 'South west',
    6: 'Southern',
    7: 'Thames',
    8: 'Wales'
  }
  return codes[parseInt(regionCode)]
}

module.exports = {
  getRegion
}
