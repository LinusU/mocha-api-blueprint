var extend = require('xtend')
var assert = require('assert')
var typeIs = require('type-is')

var reKey = /^\{([a-z][a-z0-9]*)\}$/i

function validateJsonObject (suite, actual, expected) {
  var keys = Object.keys(expected)

  keys.forEach(function (key) {
    var m = reKey.exec(expected[key])
    if (m === null) return

    var op = {}
    op[key] = actual[key]
    suite.store[m[1]] = actual[key]
    expected = extend(expected, op)
  })

  assert.deepEqual(actual, expected)
}

function validateJsonArray (suite, actual, expected) {
  var i

  assert.equal(actual.length, expected.length)

  for (i = 0; i < actual.length; i++) {
    validateJsonObject(suite, actual[i], expected[i])
  }
}

function validateJsonBody (suite, actual, expected) {
  var a = (typeof actual === 'string' ? JSON.parse(actual) : actual)
  var b = JSON.parse(expected)

  if (Array.isArray(a) !== Array.isArray(b)) {
    if (Array.isArray(b)) {
      throw new Error('Expected array')
    } else {
      throw new Error('Expected object')
    }
  }

  if (Array.isArray(a)) {
    validateJsonArray(suite, a, b)
  } else {
    validateJsonObject(suite, a, b)
  }
}

function validateHeaders (suite, actual, expected) {
  Object.keys(expected).forEach(function (key) {
    assert.ok(actual.hasOwnProperty(key), 'Has header `' + key + '`')
    assert.equal(actual[key], expected[key])
  })
}

function validateStatusCode (suite, actual, expected) {
  var msg = 'The status codes should match (' + actual + ', ' + expected + ')'
  assert.equal(actual, expected, msg)
}

function validateResponse (suite, actual, expected) {
  validateStatusCode(suite, actual.statusCode, expected.statusCode)
  validateHeaders(suite, actual.headers, expected.headers)

  if (typeIs(actual, ['json', '+json'])) {
    validateJsonBody(suite, actual.body, expected.body)
  } else {
    assert.equal(actual.body, expected.body)
  }
}

module.exports = validateResponse
