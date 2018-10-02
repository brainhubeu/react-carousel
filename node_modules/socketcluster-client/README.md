SocketCluster Client
======

SocketCluster Client is the client-side component of SocketCluster.

To install, run:

```bash
npm install socketcluster-client
```

The socketcluster-client script is called socketcluster.js (located in the main socketcluster-client directory)
- You should include it in your HTML page using a &lt;script&gt; tag in order to interact with SocketCluster.

To build SocketCluster Client with browserify, use:

```
browserify -s socketCluster index.js > socketcluster.js
```

## How to use

Embed in your HTML page using (Note that the src attribute may be different depending on how you setup your HTTP server):

```html
<script type="text/javascript" src="/socketcluster.js"></script>
```

Once you have embedded the client socketcluster.js into your page, you will gain access to a global socketCluster object.
Then, to begin interacting with the SocketCluster cluster, you will need to establish a connection.
Once that's done, you will be able to emit events to the server and listen to incoming events (example code):

```js
var options = {
  port: 8000
};

// Initiate the connection to the server
var socket = socketCluster.connect(options);
socket.on('connect', function () {
  console.log('CONNECTED');
});

// Listen to an event called 'rand' from the server
socket.on('rand', function (num) {
  console.log('RANDOM: ' + num);
  var curHTML = document.body.innerHTML;
  curHTML += 'RANDOM: ' + num + '<br />';
  document.body.innerHTML = curHTML;
});
```

Example with HTTPS:

```js
var options = {
  hostname: 'securedomain.com',
  secure: true,
  port: 443,
  rejectUnauthorized: false // Only necessary during debug if using a self-signed certificate
};

// Initiate the connection to the server
var socket = socketCluster.connect(options);
```

## License

(The MIT License)

Copyright (c) 2013-2017 SocketCluster.io

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
