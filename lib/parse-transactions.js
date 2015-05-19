var makeUri = require('./make-uri')

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
        headers: (exReq ? exReq.headers : []),
        body: (exReq ? exReq.body : undefined)
      },
      res: {
        status: Number(exRes.name),
        headers: (exRes ? exRes.headers : []),
        body: (exRes ? exRes.body : undefined)
      }
    })
  }

  return result
}

module.exports = parseTransactions
