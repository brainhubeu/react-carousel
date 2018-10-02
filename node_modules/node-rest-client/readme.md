# REST Client for Node.js

**NOTE:** _Since version 0.8.0 node does not contain node-waf anymore. The node-zlib package which node-rest-client make use of, depends on node-waf.Fortunately since version 0.8.0 zlib is a core dependency of node, so since version 1.0 of node-rest-client the explicit dependency to "zlib" has been removed from package.json. therefore if you are using a version below 0.8.0 of node please use a versión below 1.0.0 of "node-rest-client". _ 

Allows connecting to any API REST and get results as js Object. The client has the following features:

- Transparent HTTP/HTTPS connection to remote API sites.
- Allows simple HTTP basic authentication.
- Allows most common HTTP operations: GET, POST, PUT, DELETE, PATCH.
- Direct or through proxy connection to remote API sites.
- Register remote API operations as client own methods, simplifying reuse.
- Automatic parsing of XML and JSON response documents as js objects.
- Dynamic path and query parameters and request headers.
- Improved Error handling mechanism (client or specific request)
- Added support for compressed responses: gzip and deflate


## Installation

$ npm install node-rest-client

## Usages

### Simple HTTP GET

Client has 2 ways to call a REST service: direct or using registered methods

```javascript
var Client = require('node-rest-client').Client;

var client = new Client();

// direct way
client.get("http://remote.site/rest/xml/method", function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// registering remote methods
client.registerMethod("jsonMethod", "http://remote.site/rest/json/method", "GET");

client.methods.jsonMethod(function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});
```

### HTTP POST 

POST, PUT or PATCH method invocation are configured like GET calls with the difference that you have to set "Content-Type" header in args passed to client method invocation:

```javascript
//Example POST method invocation
var Client = require('node-rest-client').Client;

var client = new Client();

// set content-type header and data as json in args parameter
var args = {
	data: { test: "hello" },
	headers: { "Content-Type": "application/json" }
};

client.post("http://remote.site/rest/xml/method", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// registering remote methods
client.registerMethod("postMethod", "http://remote.site/rest/json/method", "POST");

client.methods.postMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});
```
If no "Content-Type" header is set as client arg POST,PUT and PATCH methods will not work properly.


### Passing args to registered methods

You can pass diferents args to registered methods, simplifying reuse: path replace parameters, query parameters, custom headers 

```javascript
var Client = require('node-rest-client').Client;

// direct way
var client = new Client();

var args = {
	data: { test: "hello" }, // data passed to REST method (only useful in POST, PUT or PATCH methods)
	path: { "id": 120 }, // path substitution var
	parameters: { arg1: "hello", arg2: "world" }, // query parameter substitution vars
	headers: { "test-header": "client-api" } // request headers
};


client.get("http://remote.site/rest/json/${id}/method?arg1=hello&arg2=world", args,
	function (data, response) {
		// parsed response body as js object
		console.log(data);
		// raw response
		console.log(response);
	});


// registering remote methods
client.registerMethod("jsonMethod", "http://remote.site/rest/json/${id}/method", "GET");


/* this would construct the following URL before invocation
 *
 * http://remote.site/rest/json/120/method?arg1=hello&arg2=world
 *
 */
client.methods.jsonMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});
```

You can even use path placeholders in query string in direct connection:

```javascript
var Client = require('node-rest-client').Client;

// direct way
var client = new Client();

var args = {
	path: { "id": 120, "arg1": "hello", "arg2": "world" },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" }
};

client.get("http://remote.site/rest/json/${id}/method?arg1=${arg1}&arg2=${arg2}", args,
	function (data, response) {
		// parsed response body as js object
		console.log(data);
		// raw response
		console.log(response);
	});
```



###  HTTP POST and PUT methods

To send data to remote site using POST or PUT methods, just add a data attribute to args object:

```javascript
var Client = require('node-rest-client').Client;

// direct way
var client = new Client();

var args = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>"
};

client.post("http://remote.site/rest/xml/${id}/method?arg1=hello&arg2=world", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// registering remote methods
client.registerMethod("xmlMethod", "http://remote.site/rest/xml/${id}/method", "POST");


client.methods.xmlMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// posted data can be js object
var args_js = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: { "arg1": "hello", "arg2": 123 }
};

client.methods.xmlMethod(args_js, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});
```

### Request/Response configuration

It's also possible to configure each request and response, passing its configuration as an
additional argument in method call.

```javascript
var client = new Client();

// request and response additional configuration
var args = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>",
	requestConfig: {
		timeout: 1000, //request timeout in milliseconds
		noDelay: true, //Enable/disable the Nagle algorithm
		keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
		keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
	},
	responseConfig: {
		timeout: 1000 //response timeout
	}
};


client.post("http://remote.site/rest/xml/${id}/method?arg1=hello&arg2=world", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});
```
If you want to handle timeout events both in the request and in the response just add a new "requestTimeout"
or "responseTimeout" event handler to clientRequest returned by method call.

```javascript
var client = new Client();

// request and response additional configuration
var args = {
	path: { "id": 120 },
	parameters: { arg1: "hello", arg2: "world" },
	headers: { "test-header": "client-api" },
	data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>",
	requestConfig: {
		timeout: 1000, //request timeout in milliseconds
		noDelay: true, //Enable/disable the Nagle algorithm
		keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
		keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
	},
	responseConfig: {
		timeout: 1000 //response timeout
	}
};


var req = client.post("http://remote.site/rest/xml/${id}/method?arg1=hello&arg2=world", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

req.on('requestTimeout', function (req) {
	console.log('request has expired');
	req.abort();
});

req.on('responseTimeout', function (res) {
	console.log('response has expired');

});

//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
req.on('error', function (err) {
	console.log('request error', err);
});
```


### Connect through proxy

Just pass proxy configuration as option to client.


```javascript
var Client = require('node-rest-client').Client;

// configure proxy
var options_proxy = {
	proxy: {
		host: "proxy.foo.com",
		port: 8080,
		user: "proxyuser",
		password: "123",
		tunnel: true
	}
};

var client = new Client(options_proxy);
```

client has 2 ways to connect to target site through a proxy server: tunnel or direct request, the first one is the default option
so if you want to use direct request you must set tunnel off.

```javascript
var Client = require('node-rest-client').Client;

// configure proxy
var options_proxy = {
	proxy: {
		host: "proxy.foo.com",
		port: 8080,
		user: "proxyuser",
		password: "123",
		tunnel: false // use direct request to proxy
	}
};

var client = new Client(options_proxy);
```



### Basic HTTP auth

Just pass username and password or just username, if no password is required by remote site, as option to client. Every request done with the client will pass username and password or just username if no password is required as basic authorization header.

```javascript
var Client = require('node-rest-client').Client;

// configure basic http auth for every request
var options_auth = { user: "admin", password: "123" };

var client = new Client(options_auth);
```

### Options parameters

You can pass the following args when creating a new client:

```javascript
var options = {
	// proxy configuration
	proxy: {
		host: "proxy.foo.com", // proxy host
		port: 8080, // proxy port
		user: "ellen", // proxy username if required
		password: "ripley" // proxy pass if required
	},
	// aditional connection options passed to node http.request y https.request methods 
	// (ie: options to connect to IIS with SSL)	
	connection: {
		secureOptions: constants.SSL_OP_NO_TLSv1_2,
		ciphers: 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
		honorCipherOrder: true
	},
	// customize mime types for json or xml connections
	mimetypes: {
		json: ["application/json", "application/json;charset=utf-8"],
		xml: ["application/xml", "application/xml;charset=utf-8"]
	},
	user: "admin", // basic http auth username if required
	password: "123", // basic http auth password if required
	requestConfig: {
		timeout: 1000, //request timeout in milliseconds
		noDelay: true, //Enable/disable the Nagle algorithm
		keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
		keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
	},
	responseConfig: {
		timeout: 1000 //response timeout
	}
};
```
Note that requestConfig and responseConfig options if set on client instantiation apply to all of its requests/responses
and is only overriden by request or reponse configs passed as args in method calls.


### Managing Requests

Each REST method invocation returns a request object with specific request options and error, requestTimeout and responseTimeout event handlers.

```javascript
var Client = require('node-rest-client').Client;

var client = new Client();

var args = {
	requesConfig: { timeout: 1000 },
	responseConfig: { timeout: 2000 }
};

// direct way
var req1 = client.get("http://remote.site/rest/xml/method", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// view req1 options		
console.log(req1.options);


req1.on('requestTimeout', function (req) {
	console.log("request has expired");
	req.abort();
});

req1.on('responseTimeout', function (res) {
	console.log("response has expired");

});


// registering remote methods
client.registerMethod("jsonMethod", "http://remote.site/rest/json/method", "GET");

var req2 = client.methods.jsonMethod(function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// handling specific req2 errors
req2.on('error', function (err) {
	console.log('something went wrong on req2!!', err.request.options);
});
```

###  Error Handling

 Now you can handle error events in two places: on client or on each request.

```javascript
var client = new Client(options_auth);

// handling request error events
client.get("http://remote.site/rest/xml/method", function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
}).on('error', function (err) {
	console.log('something went wrong on the request', err.request.options);
});

// handling client error events
client.on('error', function (err) {
	console.error('Something went wrong on the client', err);
});
```
