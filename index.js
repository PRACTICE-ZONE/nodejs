/* 
primary files for the API
*/

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

// server should respond to all request with string

var server = http.createServer(function(req, res) {
    // Get the url and parse it 
    const parsedUrl = url.parse(req.url, true)

    //get the path
    var path = parsedUrl.pathname;

    //trim the path
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    var queryStringObject = parsedUrl.query;
    console.log("query string", queryStringObject)

    //get the http method
    var method = req.method;
    console.log("Request received: " + trimmedPath + " with method: " + method);

    //get the headers as an object
    var headers = req.headers;

    // Get the payload if there is any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data)
    });

    req.on('end', function(){
      buffer += decoder.end();
        // choose the handler this request should go to. If one is not found use the not found handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        // construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // use the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            // use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};
            // convert the payload to a string
            var payloadString = JSON.stringify(payload);
            // return the response
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Request received with this payload:', statusCode, payloadString, buffer);
        });

        res.end('Hello World\n');
    });
    // send the response
    res.end("Hellow world I try node js");
})

server.listen(config.port, function() {
    console.log("The server is listening on port 3000 now");
})

// define the handlers
var handlers = {};

// sample handler
handlers.sample = function(data, callback){
    // callback a http status code, and a payload object
    callback(406, {'name': 'sample handler'});
};

// not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

// define a request router
var router = {
  'sample': handlers.sample
}