var extend = require('xtend')
var assert = require('assert')
var typeIs = require('type-is')

var reKey = /^\{([a-z][a-z0-9]*)\}$/i

function isObject (val) {
  return (typeof val === 'object' && val !== null)
}

function immutableSet (obj, key, val) {
  if (Array.isArray(obj)) {
    var next = obj.slice()
    next[key] = val
    return next
  }

  var op = {}
  op[key] = val
  return extend(obj, op)
}

function replaceVariables (suite, actual, expected) {
  var keys = Object.keys(expected)
  var result = expected

  keys.forEach(function (key) {
    var val = expected[key]

    if (typeof actual !== typeof expected) {
      return
    }

    if (isObject(val)) {
      var next = replaceVariables(suite, actual[key], val)
      if (next !== val) result = immutableSet(result, key, next)
      return
    }

    if (typeof val === 'string') {
      var m = reKey.exec(val)
      if (m === null) return

      suite.store[m[1]] = actual[key]
      result = immutableSet(result, key, actual[key])
      return
    }
  })

  return result
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

  assert.deepEqual(a, replaceVariables(suite, a, b))
}

function validateLocation (suite, actual, expected) {
  var a = actual.split('/')
  var b = expected.split('/')

  if (a.length !== b.length) {
    assert.equal(actual, expected)
  }

  var replaced = replaceVariables(suite, a, b)
  assert.equal(actual, replaced.join('/'))
}

function validateHeaders (suite, actual, expected) {
  Object.keys(expected).forEach(function (key) {
    assert.ok(actual.hasOwnProperty(key), 'Has header `' + key + '`')

    if (key === 'location') {
      validateLocation(suite, actual[key], expected[key])
    } else {
      assert.equal(actual[key], expected[key])
    }
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
