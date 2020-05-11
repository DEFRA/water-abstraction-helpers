'use strict';

const deepMap = require('deep-map');

/**
 * Formats a NGR reference to string format
 * @param {String} sheet - the sheet string, 2 chars
 * @param {String} east - the eastings
 * @param {String} north - the northings
 * @return {String} - grid reg, eg SP 123 456
 */
function formatNGRPointStr (sheet, east, north) {
  if (!sheet) {
    return null;
  }
  return `${sheet} ${east.substr(0, 3)} ${north.substr(0, 3)}`;
}

/**
 * Converts a point in NALD data to our format with {ngr1, ngr2, ngr3, ngr4, name}
 * @param {Object} NALD point data
 * @return {Object} point data
 */
function formatAbstractionPoint (point) {
  return {
    ngr1: formatNGRPointStr(point.NGR1_SHEET, point.NGR1_EAST, point.NGR1_NORTH),
    ngr2: formatNGRPointStr(point.NGR2_SHEET, point.NGR2_EAST, point.NGR2_NORTH),
    ngr3: formatNGRPointStr(point.NGR3_SHEET, point.NGR3_EAST, point.NGR3_NORTH),
    ngr4: formatNGRPointStr(point.NGR4_SHEET, point.NGR4_EAST, point.NGR4_NORTH),
    name: point.LOCAL_NAME
  };
};

/**
 * Formats contact address
 * @param {Object} contactAddress - party/role address
 * @return {Object} reformatted address
 */
const addressFormatter = (contactAddress) => ({
  addressLine1: contactAddress.ADDR_LINE1,
  addressLine2: contactAddress.ADDR_LINE2,
  addressLine3: contactAddress.ADDR_LINE3,
  addressLine4: contactAddress.ADDR_LINE4,
  town: contactAddress.TOWN,
  county: contactAddress.COUNTY,
  postcode: contactAddress.POSTCODE,
  country: contactAddress.COUNTRY
});

/**
 * Formats a party name - whether person or organisation
 * @param {Object} party - NALD party / role party
 * @return {Object} contact name
 */
const nameFormatter = (party) => {
  if (party.APAR_TYPE === 'PER') {
    const parts = [party.SALUTATION, party.INITIALS, party.NAME];
    return {
      contactType: 'Person',
      name: parts.filter(s => s).join(' ')
    };
  }
  if (party.APAR_TYPE === 'ORG') {
    return {
      contactType: 'Organisation',
      name: party.NAME
    };
  }
};

/**
 * Format name parts from NALD party for CRM contacts
 * @param {Object} party
 * @return {Object} party
 */
const crmNameFormatter = (party) => {
  const { SALUTATION: salutation, INITIALS: initials, NAME: name, APAR_TYPE, FORENAME: forename } = party;
  return {
    type: APAR_TYPE === 'PER' ? 'Person' : 'Organisation',
    salutation,
    forename,
    initials,
    name
  };
};


exports.addressFormatter = addressFormatter;
exports.nameFormatter = nameFormatter;
exports.crmNameFormatter = crmNameFormatter;


exports.formatAbstractionPoint = formatAbstractionPoint;
exports.formatNGRPointStr = formatNGRPointStr;
