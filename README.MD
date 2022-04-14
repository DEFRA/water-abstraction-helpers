# Water Abstraction helpers

[![Maintainability](https://api.codeclimate.com/v1/badges/364c764646e6d476559a/maintainability)](https://codeclimate.com/github/DEFRA/water-abstraction-helpers/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/364c764646e6d476559a/test_coverage)](https://codeclimate.com/github/DEFRA/water-abstraction-helpers/test_coverage)
[![Build Status](https://travis-ci.com/DEFRA/water-abstraction-helpers.svg?branch=master)](https://travis-ci.com/DEFRA/water-abstraction-helpers)

This project contains shared code that is used across the water Abstraction
service.

## Development Team

This module was developed by the Water Resource Licensing Service team as part of a digital transformation project at [DEFRA](https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs), a department of the UK government

To find out more about planned reforms to the abstraction licensing service, see the policy paper: [Water abstraction plan: Abstraction licensing service](https://www.gov.uk/government/publications/water-abstraction-plan-2017/water-abstraction-plan-abstraction-licensing-service)


## Publishing to NPM

This module is available via npm. The steps to publish are as follows: 
- Create a branch to make changes
- Ensure the pipeline passes 
- Merge into master
- Create a Release / Tag (This will trigger the release pipeline)

The pipeline relies on a `WATER_NPM_TOKEN` to publish to npm which is held by the DEFRA organization. 

## Contributing to this project

If you have an idea you'd like to contribute please log an issue.

All contributions should be submitted via a pull request.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
