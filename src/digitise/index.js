'use strict'
const deepMap = require('deep-map')
const reducer = require('./reducer')
const {
  getInitialState,
  stateManager
} = require('./state-manager')
const actionTypes = require('./action-types')
const statuses = require('./statuses')
const { pickBy, isArray, isObject, mapValues, pick, setWith, find } = require('lodash')
const {
  getAddress,
  getPurpose,
  getLicence,
  getPoint,
  getCondition,
  getVersion,
  getParty,
  getPurposes,
  getPoints,
  getConditions,
  getCurrentVersion,
  getCurrentVersionParty,
  getCurrentVersionAddress
} = require('./licence-helpers')
const {
  getSchemaCategories,
  getSchemaCategory
} = require('./schema-helpers')
const { parseNaldDataURI } = require('./nald-uri-parser')
const { getWR22 } = require('./schema')
/**
 * Convert 'null' or '' string to real null
 * @param {Object} data
 * @return {Object} with any 'null' converted to null
 */
const transformNulls = data => deepMap(data, val => {
  // Convert string null to real null
  if (typeof (val) === 'string' && (val === '' || val === 'null')) {
    return null
  }
  return val
})

/**
 * A function that generates a simple JSON schema as a starting point for the supplied object
 * all fields are set to strings
 * @param {Object} obj
 * @return {Object} JSON schema
 */
const generateJsonSchema = obj => ({
  type: 'object',
  properties: mapValues(obj, () => {
    return {
      type: 'string'
    }
  })
})

/**
 * Like lodash set, but always creates an object
 * even if key is numeric
 * @param {Object} obj
 * @param {String} path
 * @param {Mixed} value
 * @return {Object}
 */
const setObject = (obj, path, value) => setWith(obj, path, value, subObj => subObj || {})

/**
 * Checks for match for items with integer ids
 * @param {Object} item
 * @param {Number} item.ID
 * @param {Number} id - ID to check item ID against
 * @return {Boolean}
 */
const isMatch = (item, id) => parseInt(item.ID) === parseInt(id)

/**
 * Checks if version matches the supplied issue and increment number
 * @param {Object} version
 * @param {Number} issueNumber
 * @param {Number} incrementNumber
 * @return {Boolean}
 */
const isVersion = (version, issueNumber, incrementNumber) =>
  issueNumber === parseInt(version.ISSUE_NO) && incrementNumber === parseInt(version.INCR_NO)

/**
 * Formats the supplied object and filters out any non-scalar values
 * @param {Object} base - base licence data from permit repo
 * @param {Object} reform - AR version of data
 * @return {Object} in form { base, reform } with non-scalars removed
 */
const formatObject = (base, reform) => {
  return {
    base: filterScalars(base),
    reform: filterScalars(reform)
  }
}

/**
 * Prepare an item for the view data, with both base licence and reform data
 * @param {Object} licence - data loaded from permit repo
 * @param {Object} finalState - the data after passing through the AR reducer
 * @param {Function} [getter] - a function which gets the relevant portion of the state from the whole object
 * @return {Object} in the form { base, reform }
 */
const prepareItem = (licence, finalState, getter = x => x) => {
  const base = getter(licence.licence_data_value)
  const reform = getter(finalState.licence)
  return formatObject(base, reform)
}

/**
 * Given an object and a JSON schema, returns only the properties in the
 * object that are defined in the 'properties' section of the JSON schema
 * @param {Object} object - the data object
 * @param {Object} schema - JSON schema
 * @return {Object}
 */
const extractData = (object, schema) => pick(object, Object.keys(schema.properties))

/**
 * Maps an AR item in the AR licence to a format expected by the view
 * @param  {Object} item - item from arData in licence
 * @return {Object}      - item for display in the view
 */
const mapARItem = item => {
  const { schema: schemaName } = item
  const schema = find(getWR22(), { id: schemaName })

  const { id: naldConditionId } = parseNaldDataURI(item.content.nald_condition.id)

  return {
    id: item.id,
    schema: schemaName,
    title: `${schema.title} ${schema.category}`,
    description: schema.description,
    data: item.content,
    naldConditionId
  }
}

/**
 * Prepares data for use in single licence view
 * @param {Object} licence - the base licence
 * @param {Object} finalState - the final state from the reducer
 * @return {Object} view data
 */
const prepareData = (licence, finalState) => {
  const base = prepareItem(licence, finalState)
  const currentVersion = prepareItem(licence, finalState, getCurrentVersion)
  const party = prepareItem(licence, finalState, getCurrentVersionParty)
  const address = prepareItem(licence, finalState, getCurrentVersionAddress)

  // Prepare purposes
  const purposes = getPurposes(licence.licence_data_value).map((purpose, index) => {
    return {
      base: filterScalars(purpose),
      reform: filterScalars(getPurposes(finalState.licence)[index])
    }
  })

  // Prepare points
  const points = getPoints(licence.licence_data_value).map((point, index) => {
    return {
      base: filterScalars(point),
      reform: filterScalars(getPoints(finalState.licence)[index])
    }
  })

  // Conditions
  const conditions = getConditions(licence.licence_data_value).map((condition, index) => {
    return {
      base: filterScalars(condition),
      reform: filterScalars(getConditions(finalState.licence)[index])
    }
  })

  const arDataArray = finalState.licence.arData || []

  const arData = arDataArray.filter(x => x.content.nald_condition).map(mapARItem)

  return {
    currentVersion,
    purposes,
    points,
    conditions,
    party,
    address,
    arData,
    licence: base,
    notes: finalState.notes
  }
}

/**
 * Returns obj with non-scalar values removed
 * @param {Object} obj
 * @return {Object}
 */
const filterScalars = obj => pickBy(obj, val => !(isArray(val) || isObject(val)))

module.exports = {
  getPurpose,
  getLicence,
  getPoint,
  getCondition,
  getConditions,
  getVersion,
  getParty,
  getAddress,
  mapARItem,
  getWR22,
  getSchemaCategories,
  getSchemaCategory,
  generateJsonSchema,
  transformNulls,
  setObject,
  isMatch,
  isVersion,
  extractData,
  prepareData,
  filterScalars,
  reducer,
  getInitialState,
  stateManager,
  statuses,
  parseNaldDataURI,
  actionTypes
}
