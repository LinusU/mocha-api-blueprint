var makeUri = require('./make-uri')

function parseHeaders (headers) {
  return headers.reduce(function (result, header) {
    result[header.name.toLowerCase()] = header.value
    return result
  }, Object.create(null))
}

function parseTransactions (suite, resource, action, example) {
  var i, len = Math.max(example.requests.length, example.responses.length)
  var result = []
  var path = makeUri(suite, resource.uriTemplate, resource.parameters)

  for (i = 0; i < len; i++) {
    var exReq = example.requests[i]
    var exRes = example.responses[i]

    result.push({
      req: {
        path: path,
        method: action.method,
        headers: parseHeaders(exReq ? exReq.headers : []),
        body: (exReq ? exReq.body : undefined)
      },
      res: {
        statusCode: Number(exRes.name),
        headers: parseHeaders(exRes ? exRes.headers : []),
        body: (exRes ? (exRes.body || undefined) : undefined)
      }
    })
  }

  return result
}

module.exports = parseTransactions
