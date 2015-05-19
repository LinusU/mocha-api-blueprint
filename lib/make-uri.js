function makeUri (suite, uriTemplate, parameters) {
  var substitutes = Object.create(null)

  parameters.forEach(function (param) {
    substitutes[param.name] = param.example
  })

  Object.keys(suite.store).forEach(function (key) {
    substitutes[key] = suite.store[key]
  })

  return uriTemplate.replace(/\{([a-z][a-z0-9]*)\}/ig, function (m, key) {
    if (key in substitutes) return substitutes[key]
    throw new Error('Unknown variable: ' + key)
  })
}

module.exports = makeUri
