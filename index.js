var validateResponse = require('./lib/validate-response')
var registerTransactions = require('./lib/register-transactions')

function Suite () {
  this.store = Object.create(null)
}

Suite.prototype.registerTransactions = function (ast, fn) {
  registerTransactions(this, ast, fn)
}

Suite.prototype.validateResponse = function (actual, expected) {
  validateResponse(this, actual, expected)
}

exports.Suite = Suite
