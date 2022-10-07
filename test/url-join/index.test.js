'use strict'

const { expect } = require('@hapi/code')
const { experiment, test } = exports.lab = require('@hapi/lab').script()

const urlJoin = require('../../src/url-join')

experiment('urlJoin', () => {
  experiment('Test suite covering scenarios in existing code', () => {
    test('correctly joins a simple url', () => {
      const result = urlJoin('https://test.com', 'first', 'second')
      expect(result).to.equal('https://test.com/first/second')
    })

    test('correctly joins a url with a parameter', () => {
      const result = urlJoin('https://test.com', 'test', 'param?test=true')
      expect(result).to.equal('https://test.com/test/param?test=true')
    })

    test('correctly joins a url with a path already in the domain', () => {
      const result = urlJoin('https://test.com/first', 'second')
      expect(result).to.equal('https://test.com/first/second')
    })

    test('correctly joins a url with multiple paths in one element', () => {
      const result = urlJoin('https://test.com', 'first/second')
      expect(result).to.equal('https://test.com/first/second')
    })

    test('correctly joins urls without a domain', () => {
      const result = urlJoin('/nodomain', 'thankyou')
      expect(result).to.equal('/nodomain/thankyou')
    })
  })

  /**
   * Adapted from url-join's test suite:
   * https://github.com/jfromaniello/url-join/blob/main/test/tests.js
   */
  experiment('Test suite covering url-join compatibility', () => {
    test('should work for simple case', () => {
      expect(urlJoin('http://www.google.com/', 'foo/bar', '?test=123'))
        .to.equal('http://www.google.com/foo/bar?test=123')
    })

    test('should work for simple case with new syntax', () => {
      expect(urlJoin(['http://www.google.com/', 'foo/bar', '?test=123']))
        .to.equal('http://www.google.com/foo/bar?test=123')
    })

    test('should work for hashbang urls', () => {
      expect(urlJoin(['http://www.google.com', '#!', 'foo/bar', '?test=123']))
        .to.equal('http://www.google.com/#!/foo/bar?test=123')
    })

    test('should be able to join protocol', () => {
      expect(urlJoin('http:', 'www.google.com/', 'foo/bar', '?test=123'))
        .to.equal('http://www.google.com/foo/bar?test=123')
    })

    test('should be able to join protocol with slashes', () => {
      expect(urlJoin('http://', 'www.google.com/', 'foo/bar', '?test=123'))
        .to.equal('http://www.google.com/foo/bar?test=123')
    })

    test('should remove extra slashes', () => {
      expect(urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123'))
        .to.equal('http://www.google.com/foo/bar?test=123')
    })

    test('should not remove extra slashes in an encoded URL', () => {
      expect(urlJoin('http:', 'www.google.com///', 'foo/bar', '?url=http%3A//Ftest.com'))
        .to.equal('http://www.google.com/foo/bar?url=http%3A//Ftest.com')

      expect(urlJoin('http://a.com/23d04b3/', '/b/c.html'))
        .to.equal('http://a.com/23d04b3/b/c.html')
        .to.not.equal('http://a.com/23d04b3//b/c.html')
    })

    test('should support anchors in urls', () => {
      expect(urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '#faaaaa'))
        .to.equal('http://www.google.com/foo/bar?test=123#faaaaa')
    })

    test('should merge multiple query params properly', () => {
      expect(urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '?key=456'))
        .to.equal('http://www.google.com/foo/bar?test=123&key=456')

      expect(urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '?boom=value', '&key=456'))
        .to.equal('http://www.google.com/foo/bar?test=123&boom=value&key=456')

      expect(urlJoin('http://example.org/x', '?a=1', '?b=2', '?c=3', '?d=4'))
        .to.equal('http://example.org/x?a=1&b=2&c=3&d=4')
    })

    test('should merge slashes in paths correctly', () => {
      expect(urlJoin('http://example.org', 'a//', 'b//', 'A//', 'B//'))
        .to.equal('http://example.org/a/b/A/B/')
    })

    test('should merge colons in paths correctly', () => {
      expect(urlJoin('http://example.org/', ':foo:', 'bar'))
        .to.equal('http://example.org/:foo:/bar')
    })

    test('should merge just a simple path without URL correctly', () => {
      expect(urlJoin('/', 'test'))
        .to.equal('/test')
    })

    test('should fail with segments that are not string', () => {
      expect(() => urlJoin(true)).to.throw(TypeError,
        /Url must be a string. Received true/)
      expect(() => urlJoin('http://blabla.com/', 1)).to.throw(TypeError,
        /Url must be a string. Received 1/)
      expect(() => urlJoin('http://blabla.com/', undefined, 'test')).to.throw(TypeError,
        /Url must be a string. Received undefined/)
      expect(() => urlJoin('http://blabla.com/', null, 'test')).to.throw(TypeError,
        /Url must be a string. Received null/)
      expect(() => urlJoin('http://blabla.com/', { foo: 123 }, 'test')).to.throw(TypeError,
        /Url must be a string. Received \[object Object\]/)
    })

    test('should merge a path with colon properly', () => {
      expect(urlJoin('/users/:userId', '/cars/:carId'))
        .to.equal('/users/:userId/cars/:carId')
    })

    test('should merge slashes in protocol correctly', () => {
      expect(urlJoin('http://example.org', 'a'))
        .to.equal('http://example.org/a')
      expect(urlJoin('http:', '//example.org', 'a'))
        .to.equal('http://example.org/a')
      expect(urlJoin('http:///example.org', 'a'))
        .to.equal('http://example.org/a')
    })

    test('should skip empty strings', () => {
      expect(urlJoin('http://foobar.com', '', 'test'))
        .to.equal('http://foobar.com/test')
      expect(urlJoin('', 'http://foobar.com', '', 'test'))
        .to.equal('http://foobar.com/test')
    })

    test('should return an empty string if no arguments are supplied', () => {
      expect(urlJoin()).to.be.empty()
    })
  })
})
