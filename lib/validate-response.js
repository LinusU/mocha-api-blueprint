var extend = require('xtend')
var assert = require('assert')

var reKey = /^\{([a-z][a-z0-9]*)\}$/i

function validateResponse (suite, actual, expected) {
  if (Array.isArray(actual) && Array.isArray(expected) && actual.length === 1 && expected.length === 1) {
    return validateResponse(suite, actual[0], expected[0])
  }

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

module.exports = validateResponse
