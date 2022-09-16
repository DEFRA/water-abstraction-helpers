const { find, flatMap } = require('lodash')

// Structure of categories/subcats
// [
//   {
//     slug: 'some-slug',
//     title: 'Category name',
//     subcategories: [{
//       title: 'Subcategory name',
//       schemas: ['id-1', 'id-2']
//     }]
//   }
// ];

/**
 * Converts a string to a slug: strips out disallowed chars, replaces spaces with `-`, and converts to lower case.
 *
 * Based on https://www.npmjs.com/package/slugify
 */
const slugify = string => {
  if (typeof string !== 'string') {
    throw new Error('String argument expected')
  }

  return string
    .normalize()
    // Split our string into an array of individual characters so we can iterate over it using reduce
    .split('')
    .reduce((result, currentChar) => {
      const appendChar = currentChar === '-'
        // Later we will replace multiple spaces with a single `-`. We therefore treat `-` chars in our original string
        // as spaces, so that something like `a - string` will gracefully collapse to just `a-string`
        ? ' '
        // Otherwise pass the current char through a regex which will change it to an empty string if it matches any of
        // the disallowed chars we want to strip out
        : currentChar.replace(/[^\w\s$*_+~.()'"!:@]+/g, '')

      // Append our resulting character and go again
      return result + appendChar
    }, '')
    // Trim whitespace and convert to lower case
    .trim()
    .toLowerCase()
    // Replace all spaces with `-` (with consecutive spaces being replaced with a single `-`)
    .replace(/\s+/g, '-')
}

const findByTitle = (arr, title) => find(arr, { title })

const createCategory = schema => {
  const { category } = schema
  const slug = slugify(category)
  return {
    slug,
    title: category,
    subcategories: []
  }
}

const createSubcategory = schema => {
  const { subcategory } = schema
  return {
    title: subcategory || '',
    schemas: []
  }
}

/**
 * Adds the specified item to the array and returns the item
 * @param  {Array} arr   - array of items
 * @param  {Mixed} item  - item to add
 * @return {Mixed}       - the item added
 */
const pushAndReturn = (arr, item) => {
  arr.push(item)
  return item
}

/**
 * Given an array of categories, finds or creates a category for the given schema
 * @param  {Array} arr     - array of categories
 * @param  {Object} schema - WR22 schema
 * @return {Object}        - new or existing category object
 */
const findCategory = (arr, schema) => {
  const { category } = schema
  return findByTitle(arr, category) || pushAndReturn(arr, createCategory(schema))
}

/**
 * Given an array of subcategories, finds or creates a subcategory for the given schema
 * @param  {Array} arr     - array of subcategories
 * @param  {Object} schema - WR22 schema
 * @return {Object}        - new or existing subcategory object
 */
const findSubcategory = (arr, schema) => {
  const { subcategory } = schema
  return findByTitle(arr, subcategory) || pushAndReturn(arr, createSubcategory(schema))
}

/**
 * Categorises and subcategories schema for display in schema selection page
 * If no subcategory is set, it defaults to '-'
 * @param  {Array} schema - list of custom schemas
 * @return {Object}        - indexed by category, subcategory
 */
const getSchemaCategories = schema => schema.reduce((acc, schema) => {
  const category = findCategory(acc, schema)
  const subcategory = findSubcategory(category.subcategories, schema)
  subcategory.schemas.push(schema.id)
  return acc
}, [])

/**
 * Given a schema, finds the category which contains it
 * @return {[type]}        [description]
 * @param categories
 * @param id
 */
const getSchemaCategory = (categories, id) => find(categories, category => {
  const ids = flatMap(category.subcategories, subcat => subcat.schemas)
  return ids.includes(id)
})

module.exports = {
  getSchemaCategories,
  getSchemaCategory
}
