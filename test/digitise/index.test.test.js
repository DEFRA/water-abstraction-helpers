'use strict'

const {
  experiment,
  test,
  before
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

// Thing to test
const digitise = require('../../src/digitise')

experiment('digitise/index.js', () => {
  experiment('transformNulls', () => {
    experiment('when a string \'null\' is provided', () => {
      test('transforms it to `null`', () => {
        const result = digitise.transformNulls('null')
        expect(result).to.be.null()
      })
    })

    experiment('when an empty string is provided', () => {
      test('transforms it to `null`', () => {
        const result = digitise.transformNulls('')
        expect(result).to.be.null()
      })
    })

    experiment('when `null` is provided', () => {
      test('leaves it as `null`', () => {
        const result = digitise.transformNulls(null)
        expect(result).to.be.null()
      })
    })

    experiment('when a regular string is provided', () => {
      test('leaves it as-is', () => {
        const result = digitise.transformNulls('NOT_NULL')
        expect(result).to.equal('NOT_NULL')
      })
    })

    experiment('when a number is provided', () => {
      test('leaves it as-is', () => {
        const result = digitise.transformNulls(123)
        expect(result).to.equal(123)
      })
    })

    experiment('when a mixed array is provided', () => {
      test('applies the correct transformation to each item', () => {
        const result = digitise.transformNulls(['null', null, '', 'NOT_NULL'])
        expect(result).to.equal([null, null, null, 'NOT_NULL'])
      })
    })

    experiment('when an object is provided', () => {
      test('applies the correct transformation to each item', () => {
        const result = digitise.transformNulls({
          notNulls: ['NOT_NULL', 'NOT_NULL_EITHER'],
          nulls: [null, 'null', '']
        })
        expect(result).to.equal({
          notNulls: ['NOT_NULL', 'NOT_NULL_EITHER'],
          nulls: [null, null, null]
        })
      })
    })
  })

  experiment('getWR22', () => {
    experiment('when getWR22 is called', () => {
      let wr22Data

      before(async () => {
        wr22Data = await digitise.getWR22()
      })

      test('returns an array of all json files', () => {
        expect(wr22Data.length).to.equal(220)
      })

      test('returns the json data in the array', () => {
        const [result] = wr22Data.filter(json => json.id === '/wr22/1.1')

        expect(result).to.equal({
          id: '/wr22/1.1',
          type: 'object',
          title: '1.1',
          category: 'Minimum value condition',
          subcategory: '',
          description: 'The minimum value for the quantity of water authorised to be abstracted under this licence, as referred to in section 46(2A) Water Resources Act 1991, is [annual quantity] cubic metres per year.',
          properties: {
            nald_condition: {
              $ref: 'water://licences/conditions.json',
              label: 'NALD condition',
              errors: {
                required: {
                  message: 'Select a NALD condition'
                }
              }
            }
          },
          required: [
            'nald_condition'
          ]
        })
      })
    })
  })

  experiment('.getSchemaCategories', () => {
    // Array of simplified schema, containing just a category name (taken from the current set of schema JSON files)
    const schemaArray = [
      { category: 'Minimum value condition' },
      { category: 'Hands off flows/levels' },
      { category: 'Augmentation and Compensation conditions' },
      { category: 'Flow/level measurement devices' },
      { category: 'Construction and notices' },
      { category: 'Ongoing measurement and maintenance' },
      { category: 'Recording' },
      { category: 'Storage conditions' },
      { category: 'Time Limiting - abstractions start' },
      { category: 'Chemical conditions' },
      { category: 'Land on which licence authorises use of water' },
      { category: 'Point at which water must be returned' },
      { category: 'Temporary licence provision' },
      { category: 'Groundwater conditions' },
      { category: 'Ground source heating and cooling pumps' },
      { category: 'Screening' },
      { category: 'Fish and Eel passage' },
      { category: 'Hydropower' },
      { category: 'Impounding conditions' },
      { category: 'Obstructing or impeding the flow of an inland water' },
      { category: 'Removal of impounding works' },
      { category: 'Water Rights Trading' },
      { category: 'Environmental monitoring' },
      { category: 'Control on abstraction' },
      { category: 'Derogation Agreement' }
    ]

    // What the slugs should be for the categories, based on passing the category strings through the slugify package we
    // previously used. We check that we match our existing slugs to ensure our reimplementation is fully compatible
    // with our previous use of slugify.
    const expectedSlugArray = [
      'minimum-value-condition',
      'hands-off-flowslevels',
      'augmentation-and-compensation-conditions',
      'flowlevel-measurement-devices',
      'construction-and-notices',
      'ongoing-measurement-and-maintenance',
      'recording',
      'storage-conditions',
      'time-limiting-abstractions-start',
      'chemical-conditions',
      'land-on-which-licence-authorises-use-of-water',
      'point-at-which-water-must-be-returned',
      'temporary-licence-provision',
      'groundwater-conditions',
      'ground-source-heating-and-cooling-pumps',
      'screening',
      'fish-and-eel-passage',
      'hydropower',
      'impounding-conditions',
      'obstructing-or-impeding-the-flow-of-an-inland-water',
      'removal-of-impounding-works',
      'water-rights-trading',
      'environmental-monitoring',
      'control-on-abstraction',
      'derogation-agreement'
    ]

    test('correctly generates slugs based on the schema categories', () => {
      const categories = digitise.getSchemaCategories(schemaArray)

      // Pull all category slugs out into an array for easier testing
      const slugs = categories.map(category => category.slug)

      expect(slugs).to.contain(expectedSlugArray)
    })
  })
})
