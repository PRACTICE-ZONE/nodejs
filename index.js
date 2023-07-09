/* 
primary files for the API
*/

var http = require('http');
var url = require('url');

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
    console.log(queryStringObject)

    //get the http method
    var method = req.method;
    console.log("Request reseived: " + trimmedPath+ "with method: " + method);

    //get the headers as an object
    var headers = req.headers;
    console.log(headers)
    
    // send the response
    res.end("Hellow world I try node js");
})

server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
})