/* eslint-env mocha */

var assert = require('assert')
var parseTransactions = require('./parse-transactions')

function lowerFirst (str) {
  return str.charAt(0).toLowerCase() + str.substring(1)
}

function asyncForEach (list, fn, cb) {
  function run (idx) {
    if (idx === list.length) return cb()

    fn(list[idx], function (err) {
      if (err) return cb(err)
      run(idx + 1)
    })
  }

  run(0)
}

function registerTransactions (suite, ast, fn) {
  function handleCategory (element) {
    if (element.attributes && element.attributes.name) {
      describe(element.attributes.name, function () {
        element.content.forEach(handleElement)
      })
    } else {
      element.content.forEach(handleElement)
    }
  }
  function handleResouce (element) {
    function inner () {
      element.actions.forEach(function (action) {
        it('should ' + lowerFirst(action.name), function (cb) {
          asyncForEach(action.examples, function (example, cb) {
            var transactions = parseTransactions(suite, element, action, example)

            asyncForEach(transactions, fn, cb)
          }, cb)
        })
      })
    }

    if (element.name) {
      describe(element.name, inner)
    } else {
      inner()
    }
  }
  function handleElement (element) {
    switch (element.element) {
      case 'category': return handleCategory(element)
      case 'resource': return handleResouce(element)
    }
  }

  assert.equal(ast._version, '3.0')
  ast.content.forEach(handleElement)
}

module.exports = registerTransactions
