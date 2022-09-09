'use strict'

const path = require('path')
const dummyBase = 'http://___remove_me___'

// Short helper functions
const hasQueryParam = previous => previous.includes('?')
const isAnchor = element => element.charAt(0) === '#'
const isRelative = path => path.charAt(0) === '/'
const isString = element => typeof element === 'string'
const isQueryParam = element => element.charAt(0) === '?' || element.charAt(0) === '&'

/**
 * Drop-in replacement for the url-join package, using relatively standard Node URL handling instead of multiple regexes
 * Note that unlike url-join, we do not support file:// protocol or protocol-relative urls (eg. `//domain/whatever`).
 * These are unlikely to occur in our existing codebase, unlike other cases it handles such as relative urls.
 *
 * @param {String} elements Elements of the URL to be constructed
 * @return {String} The constructed URL
 */
function urlJoin (...elements) {
  // url-join can receive a series of elements `urlJoin('1', '2')` or a single array of elements `urlJoin(['1', '2'])`.
  // To maintain compatibility we need to handle this second case.
  if (elements[0] instanceof Array) {
    elements = elements[0]
  }

  // If we have nothing to join then simply return an empty string
  if (!elements.length) {
    return ''
  }

  const joinedPath = joinElements(elements)

  // If joinedPath is relative then we supply a dummy base url so that new URL() doesn't throw an error
  const myUrl = isRelative(joinedPath) ? new URL(joinedPath, dummyBase) : new URL(joinedPath)

  // Return the final url's href, with any dummy base stripped out
  return myUrl.href.replace(dummyBase, '')
}

function joinElements (elements) {
  // We use `reduce` as it lets us see the current element for handling as well as the path string we've built up so far
  return elements.reduce((previous, current) => {
    if (!isString(current)) {
      throw new TypeError(`Url must be a string. Received ${current}`)
    }

    // If the current element is an anchor (ie. `#anchor`) then we do a simple concatenation
    if (isAnchor(current)) {
      return [previous, current].join('')
    }

    // If the current element is a query parameter (ie. `?param=123` or `&param=123`) then we ensure only the first
    // query parameter in the built string starts with `?` and all others start with `&`
    if (isQueryParam(current)) {
      const normalisedQueryParam = normaliseQueryParam(previous, current)
      return [previous, normalisedQueryParam].join('')
    }

    // Otherwise, we simply use standard path.join to join the current element to the previous ones. This is safe even
    // in Windows (where path.join appends with \ slashes) as `new URL()` will handle this for us.
    return path.join(previous, current)
  },
  // We start off with an empty string to avoid weirdness occurring if the first element is a Boolean
  '')
}

/**
 * Replaces the first char of `current` with `&` or `?` depending on whether `previous` already has a query parameter
 */
function normaliseQueryParam (previous, current) {
  return [
    hasQueryParam(previous) ? '&' : '?',
    current.substring(1)
  ].join('')
}

module.exports = urlJoin
