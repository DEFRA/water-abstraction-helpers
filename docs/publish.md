# Publishing to NPM

This module is available via npm. The steps to publish are as follows:
- Create a branch to make changes
- Ensure the pipeline passes
- Merge into master
- Create a Release / Tag (This will trigger the release pipeline)

The pipeline relies on a `WATER_NPM_TOKEN` to publish to npm which is held by the DEFRA organization. 
