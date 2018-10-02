;(function(p,c,e){function r(n){if(!c[n]){if(!p[n])return;c[n]={exports:{}};p[n][0](function(x){return r(p[n][1][x])},c[n],c[n].exports);}return c[n].exports}for(var i=0;i<e.length;i++)r(e[i]);return r})({0:[function(require,module,exports){//copyright Ryan Day 2010 <http://ryanday.org> [MIT Licensed]

var test = require('tap').test
, jsonxml = require("./jsontoxml.js")
;

var date = (new Date());
var input = {
  node:'text content',
  parent:[
    {name:'taco',text:'beef taco',children:{salsa:'hot!'}},
    {name:'taco',text:'fish taco',attrs:{mood:'sad'},children:[
     {name:'salsa',text:'mild'},
     'hi',
     {name:'salsa',text:'weak',attrs:{type:2}}
    ]},
    {name:'taco',attrs:{mood:"party!"}}
  ],
  parent2:{
    hi:'this & this is a nice thing to say',
    node:'i am another not special child node',
    date:date+'',
    date2:date
  }
};

var expected = '<node>text content</node>'
+'<parent>'
  +'<taco>'
    +'beef taco'
    +'<salsa>hot!</salsa>'
  +'</taco>'
  +'<taco mood="sad">'
    +'fish taco'
    +'<salsa>mild</salsa>'
    +'hi'
    +'<salsa type="2">weak</salsa>'
  +'</taco>'
  +"<taco mood=\"party!\"/>"
+'</parent>'
+'<parent2>'
  +'<hi>this &amp; this is a nice thing to say</hi>'
  +'<node>i am another not special child node</node>'
  +'<date>'+date+'</date>'
  +'<date2>'+date.toJSON()+'</date2>'
+'</parent2>';

var buffer = new Buffer(JSON.stringify(input));

test("creates correct object from buffer",function(t){
  var result = jsonxml(buffer,{escape:true});
  t.equals(result,expected,' should have generated correct xml');
  t.end()
});

test("creates correct object",function(t){
  var result = jsonxml(input,{escape:true});
  t.equals(result,expected,' should have generated correct xml');
  console.log(result)
  t.end()
});

},{"tap":1,"./jsontoxml.js":2}],1:[function(require,module,exports){(function(){
var GlobalHarness = require("./tap-global-harness")

// this lets you do stuff like:
// var test = require("tap").test
// test(...)
// to run stuff in the global harness.
exports = module.exports = new GlobalHarness()

exports.createProducer = exports.Producer = require("./tap-producer")
exports.createConsumer = exports.Consumer = require("./tap-consumer")
exports.yamlish = require("yamlish")
exports.createTest = exports.Test = require("./tap-test")
exports.createHarness = exports.Harness = require("./tap-harness")
exports.createRunner = exports.Runner = require("./tap-runner")
exports.assert = require("./tap-assert")

})()
},{"./tap-global-harness":3,"./tap-producer":4,"./tap-consumer":5,"yamlish":6,"./tap-test":7,"./tap-harness":8,"./tap-runner":9,"./tap-assert":10}],3:[function(require,module,exports){(function(process,global){// this is just a harness that pipes to stdout.
// It's the default one.
module.exports = GlobalHarness

var globalHarness = global.TAP_Global_Harness
  , inherits = require("inherits")
  , Results = require("./tap-results")
  , Harness = require("./tap-harness")
  , Test = require("./tap-test")

inherits(GlobalHarness, Harness)
function GlobalHarness () {
  //console.error("calling GlobalHarness")
  if (globalHarness) return globalHarness
  if (!(this instanceof GlobalHarness)) {
    return globalHarness = new GlobalHarness
  }

  globalHarness = global.TAP_Global_Harness = this
  GlobalHarness.super.call(this, Test)

  this.output.pipe(process.stdout)
  //this.output.on("data", function () {
  //  process.nextTick(process.stdout.flush.bind(process.stdout))
  //})

  this.test = this.test.bind(this)

  this.plan = this.plan.bind(this)

  var output = this.output
  this.on("childEnd", function (child) {
    //console.error("childEnd in global harness")
    //console.error(child.results)
    // write out the stuff for this child.
    //console.error("child.conf", child.conf)

    // maybe write some other stuff about the number of tests in this
    // thing, etc.  I dunno.
    //console.error("child results", child.results)
    this.results.list.forEach(function (res) {
      //delete res.error
      //console.error("child resuilt", res)
      output.write(res)
    })
    //console.error("wrote child results")
    this.results.list.length = 0
  })

  var streamEnded = false
  this.on("end", function () {
    //console.error("global ending the stream")
    if (!streamEnded) {
      this.results.list.forEach(function (res) {
        output.write(res)
      })
      this.results.list.length = 0
      output.end()
      streamEnded = true
    }
  })

  //this.on("end", this.output.end.bind(this.output))

  process.on("unhandledException", function (e) {
    this.bailout("unhandled exception: " + e.message)
  })
}

})(require("__browserify_process"),window)
},{"inherits":11,"./tap-results":12,"./tap-harness":8,"./tap-test":7,"__browserify_process":13}],11:[function(require,module,exports){module.exports = inherits

function inherits (c, p, proto) {
  proto = proto || {}
  var e = {}
  ;[c.prototype, proto].forEach(function (s) {
    Object.getOwnPropertyNames(s).forEach(function (k) {
      e[k] = Object.getOwnPropertyDescriptor(s, k)
    })
  })
  c.prototype = Object.create(p.prototype, e)
  c.super = p
}

//function Child () {
//  Child.super.call(this)
//  console.error([this
//                ,this.constructor
//                ,this.constructor === Child
//                ,this.constructor.super === Parent
//                ,Object.getPrototypeOf(this) === Child.prototype
//                ,Object.getPrototypeOf(Object.getPrototypeOf(this))
//                 === Parent.prototype
//                ,this instanceof Child
//                ,this instanceof Parent])
//}
//function Parent () {}
//inherits(Child, Parent)
//new Child

},{}],12:[function(require,module,exports){// A class for counting up results in a test harness.

module.exports = Results

var inherits = require("inherits")
  , EventEmitter = require("events").EventEmitter

inherits(Results, EventEmitter)

function Results (r) {
  //console.error("result constructor", r)
  this.ok = true
  this.addSet(r)
}

Results.prototype.addSet = function (r) {
  //console.error("add set of results", r)
  r = r || {ok: true}
  ; [ "todo"
    , "todoPass"
    , "todoFail"
    , "skip"
    , "skipPass"
    , "skipFail"
    , "pass"
    , "passTotal"
    , "fail"
    , "failTotal"
    , "tests"
    , "testsTotal" ].forEach(function (k) {
      this[k] = (this[k] || 0) + (r[k] || 0)
      //console.error([k, this[k]])
    }, this)

  this.ok = this.ok && r.ok && true
  this.bailedOut = this.bailedOut || r.bailedOut || false
  this.list = (this.list || []).concat(r.list || [])
  this.emit("set", this.list)
  //console.error("after addSet", this)
}

Results.prototype.add = function (r, addToList) {
  //console.error("add result", r)
  var pf = r.ok ? "pass" : "fail"
    , PF = r.ok ? "Pass" : "Fail"

  this.testsTotal ++
  this[pf + "Total"] ++

  if (r.skip) {
    this["skip" + PF] ++
    this.skip ++
  } else if (r.todo) {
    this["todo" + PF] ++
    this.todo ++
  } else {
    this.tests ++
    this[pf] ++
  }

  if (r.bailout || typeof r.bailout === "string") {
    // console.error("Bailing out in result")
    this.bailedOut = true
  }
  this.ok = !!(this.ok && r.ok)

  if (addToList === false) return
  this.list = this.list || []
  this.list.push(r)
  this.emit("result", r)
}

},{"inherits":11,"events":14}],14:[function(require,module,exports){(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":13}],8:[function(require,module,exports){(function(process){// a thing that runs tests.
// Every "test" is also a harness.  If they do not have a harness,
// then they are attached to the defaut "global harness",
// which writes its results to stdout.


// TODO:
// - Bailout should stop running any tests.
// - "skip" in the test config obj should skip it.

module.exports = Harness
require("inherits")(Harness, require("events").EventEmitter)

var Results = require("./tap-results")
  , TapProducer = require("./tap-producer")
  , assert = require("./tap-assert")

function Harness (Test) {
  if (!(this instanceof Harness)) return new Harness(Test)

  //console.error("Test in "+this.constructor.name, Test)

  this._Test = Test
  this._plan = null
  this._children = []
  this._started = false

  this._testCount = 0
  this._planSum = 0

  this.results = new Results()
  // emit result events on the harness.
  //this.results.on("result", function (res) {
  //  console.error("proxying result ev from res to harness")
  //  this.emit("result", res)
  //}.bind(this))
  var me = this
  this.results.on("result", this.emit.bind(this, "result"))

  var p = this.process.bind(this)
  this.process = function () {
    this._started = true
    process.nextTick(p)
  }

  this.output = new TapProducer()
  Harness.super.call(this)
}

// this function actually only gets called bound to
// the Harness object, and on process.nextTick.  Even if
// passed as an event handler, everything *else* will
// happen before it gets called.
Harness.prototype.process = function () {
  //console.error("harness process")
  // "end" can emit multiple times, so only actually move on
  // to the next test if the current one is actually over.
  // TODO: multiple in-process tests, if all are marked "async"
  if (this._current) {
    if (!this._current._ended) return
    // handle the current one before moving onto the next.
    this.childEnd(this._current)
  }
  var skip = true
  while (skip) {
    //console.error("checking for skips")
    var current = this._current = this._children.shift()
    if (current) {
      skip = current.conf.skip
      if (skip) {
        //console.error("add a failure for the skipping")
        this.results.add(assert.fail(current.conf.name
                                    ,{skip:true, diag:false}))
      }
    } else skip = false
  }

  // keep processing through skipped tests, instead of running them.
  if (current && this._bailedOut) {
    return this.process()
  }

  //console.error("got current?", !!current)
  if (current) {
    current.on("end", this.process)
    current.emit("ready")
    //console.error("emitted ready")
    //console.error("_plan", this._plan, this.constructor.name)
  } else {
    //console.error("Harness process: no more left.  ending")
    if (this._endNice) {
      this._endNice()
    } else {
      this.end()
    }
  }
}

Harness.prototype.end = function () {
  if (this._children.length) {
    return this.process()
  }
  //console.error("harness end", this.constructor.name)
  if (this._bailedOut) return

  // can't call .end() more than once.
  if (this._ended) {
    //console.error("adding failure for end calling")
    this.results.add(assert.fail("end called more than once"))
  }

  // see if the plan is completed properly, if there was one.
  if (this._plan !== null) {
    var total = this._testCount
    if (total !== this._plan) {
      this.results.add(assert.equal(total, this._plan, "test count != plan"))
    }
    this._plan = total
  }

  //console.error("setting ended true", this.constructor.name)
  this._ended = true
  this.emit("end")
}

Harness.prototype.plan = function (p) {
  //console.error("setting plan", new Error().stack)
  if (this._plan !== null) {
    //console.error("about to add failure for calling plan")
    return this.results.add(assert.fail("plan set multiple times"))
  }
  this._plan = p
  if (p === 0 || this.results.testsTotal) {
    this.end()
  }
}

Harness.prototype.childEnd = function (child) {
  //console.error("childEnd")
  this._testCount ++
  this._planSum += child._plan
  //console.error("adding set of child.results")

  this.results.add(child.conf.name || "(unnamed test)")
  this.results.addSet(child.results)
  this.emit("childEnd", child)
  // was this planned?
  if (this._plan === this._testCount) {
    //console.error("plan", [this._plan, this._testCount])
    return this.end()
  }
}

function copyObj(o) {
  var copied = {}
  Object.keys(o).forEach(function (k) { copied[k] = o[k] })
  return copied
}

Harness.prototype.test = function test (name, conf, cb) {
  if (this._bailedOut) return

  if (typeof conf === "function") cb = conf, conf = null
  if (typeof name === "object") conf = name, name = null
  if (typeof name === "function") cb = name, name = null

  conf = (conf ? copyObj(conf) : {})
  name = name || ""

  //console.error("making test", [name, conf, cb])

  // timeout: value in milliseconds. Defaults to 30s
  // Set to Infinity to have no timeout.
  if (isNaN(conf.timeout)) conf.timeout = 30000
  var t = new this._Test(this, name, conf)
  var self = this
  if (cb) {
    //console.error("attaching cb to ready event")
    t.on("ready", function () {
      if (!isNaN(conf.timeout) && isFinite(conf.timeout)) {
        var timer = setTimeout(this.timeout.bind(this), conf.timeout)
        var clear = function () {
          clearTimeout(timer)
        }
        t.on("end", clear)
        t.on("bailout", function (message) {
          self.bailout(message)
          clear()
        })
      }
    })
    t.on("ready", cb.bind(t, t))
    // proxy the child results to this object.
    //t.on("result", function (res) {
    //  console.error("in harness, proxying result up")
    //  t.results.add(res)
    //})
  }
  return t
}

Harness.prototype.bailout = function (message) {
  // console.error("Harness bailout", this.constructor.name)
  message = message || ""
  //console.error("adding bailout message result")
  this.results.add({bailout: message})
  // console.error(">>> results after bailout" , this.results)
  this._bailedOut = true
  this.emit("bailout", message)
  this.output.end({bailout: message})
}

Harness.prototype.add = function (child) {
  //console.error("adding child")
  this._children.push(child)
  if (!this._started) this.process()
}

// the tearDown function is *always* guaranteed to happen.
// Even if there's a bailout.
Harness.prototype.tearDown = function (fn) {
  this.on("end", fn)
}

})(require("__browserify_process"))
},{"inherits":11,"events":14,"./tap-results":12,"./tap-producer":4,"./tap-assert":10,"__browserify_process":13}],4:[function(require,module,exports){(function(process){module.exports = TapProducer

var Results = require("./tap-results")
  , inherits = require("inherits")
  , yamlish = require("yamlish")

TapProducer.encode = function (result, diag) {
  var tp = new TapProducer(diag)
    , out = ""
  tp.on("data", function (c) { out += c })
  if (Array.isArray(result)) {
    result.forEach(tp.write, tp)
  } else tp.write(result)
  tp.end()
  return out
}

inherits(TapProducer, require("stream").Stream)
function TapProducer (diag) {
  TapProducer.super.call(this)
  this.diag = diag
  this.count = 0
  this.readable = this.writable = true
  this.results = new Results
}

TapProducer.prototype.trailer = true

TapProducer.prototype.write = function (res) {
  // console.error("TapProducer.write", res)
  if (typeof res === "function") throw new Error("wtf?")
  if (!this.writable) this.emit("error", new Error("not writable"))

  if (!this._didHead) {
    this.emit("data", "TAP version 13\n")
    this._didHead = true
  }

  var diag = res.diag
  if (diag === undefined) diag = this.diag

  this.emit("data", encodeResult(res, this.count + 1, diag))

  if (typeof res === "string") return true

  if (res.bailout) {
    var bo = "bail out!"
    if (typeof res.bailout === "string") bo += " " + res.bailout
    this.emit("data", bo)
    return
  }
  this.results.add(res, false)

  this.count ++
}

TapProducer.prototype.end = function (res) {
  if (res) this.write(res)
  // console.error("TapProducer end", res, this.results)
  this.emit("data", "\n1.."+this.results.testsTotal+"\n")
  if (this.trailer && typeof this.trailer !== "string") {
    // summary trailer.
    var trailer = "tests "+this.results.testsTotal + "\n"
    if (this.results.pass) {
      trailer += "pass  " + this.results.pass + "\n"
    }
    if (this.results.fail) {
      trailer += "fail  " + this.results.fail + "\n"
    }
    if (this.results.skip) {
      trailer += "skip  "+this.results.skip + "\n"
    }
    if (this.results.todo) {
      trailer += "todo  "+this.results.todo + "\n"
    }
    if (this.results.bailedOut) {
      trailer += "bailed out" + "\n"
    }

    if (this.results.testsTotal === this.results.pass) {
      trailer += "\nok\n"
    }
    this.trailer = trailer
  }
  if (this.trailer) this.write(this.trailer)
  this.writable = false
  this.emit("end", null, this.count, this.ok)
}

function encodeResult (res, count, diag) {
  // console.error(res, count, diag)
  if (typeof res === "string") {
    res = res.split(/\r?\n/).map(function (l) {
      if (!l.trim()) return l.trim()
      return "# " + l
    }).join("\n")
    if (res.substr(-1) !== "\n") res += "\n"
    return res
  }

  if (res.bailout) return ""


  if (!!process.env.TAP_NODIAG) diag = false
  else if (!!process.env.TAP_DIAG) diag = true
  else if (diag === undefined) diag = !res.ok

  var output = ""
  res.name = res.name && ("" + res.name).trim()
  output += ( !res.ok ? "not " : "") + "ok " + count
            + ( !res.name ? ""
              : " " + res.name.replace(/[\r\n]/g, " ") )
            + ( res.skip ? " # SKIP"
              : res.todo ? " # TODO"
              : "" )
            + "\n"

  if (!diag) return output
  var d = {}
    , dc = 0
  Object.keys(res).filter(function (k) {
    return k !== "ok" && k !== "name" && k !== "id"
  }).forEach(function (k) {
    dc ++
    d[k] = res[k]
  })
  //console.error(d, "about to encode")
  if (dc > 0) output += "  ---"+yamlish.encode(d)+"\n  ...\n"
  return output
}

})(require("__browserify_process"))
},{"./tap-results":12,"inherits":11,"yamlish":6,"stream":15,"__browserify_process":13}],6:[function(require,module,exports){exports.encode = encode
exports.decode = decode

var seen = []
function encode (obj, indent) {
  var deep = arguments[2]
  if (!indent) indent = "  "

  if (obj instanceof String ||
      Object.prototype.toString.call(obj) === "[object String]") {
    obj = obj.toString()
  }

  if (obj instanceof Number ||
      Object.prototype.toString.call(obj) === "[object Number]") {
    obj = obj.valueOf()
  }

  // take out the easy ones.
  switch (typeof obj) {
    case "string":
      obj = obj.trim()
      if (obj.indexOf("\n") !== -1) {
        return "|\n" + indent + obj.split(/\r?\n/).join("\n"+indent)
      } else {
        return (obj)
      }

    case "number":
      return obj.toString(10)

    case "function":
      return encode(obj.toString(), indent, true)

    case "boolean":
      return obj.toString()

    case "undefined":
      // fallthrough
    case "object":
      // at this point we know it types as an object
      if (!obj) return "~"

      if (obj instanceof Date ||
          Object.prototype.toString.call(obj) === "[object Date]") {
        return JSON.stringify("[Date " + obj.toISOString() + "]")
      }

      if (obj instanceof RegExp ||
          Object.prototype.toString.call(obj) === "[object RegExp]") {
        return JSON.stringify(obj.toString())
      }

      if (obj instanceof Boolean ||
          Object.prototype.toString.call(obj) === "[object Boolean]") {
        return obj.toString()
      }

      if (seen.indexOf(obj) !== -1) {
        return "[Circular]"
      }
      seen.push(obj)

      if (typeof Buffer === "function" &&
          typeof Buffer.isBuffer === "function" &&
          Buffer.isBuffer(obj)) return obj.inspect()

      if (obj instanceof Error) {
        var o = { name: obj.name
                , message: obj.message
                , type: obj.type }

        if (obj.code) o.code = obj.code
        if (obj.errno) o.errno = obj.errno
        if (obj.type) o.type = obj.type
        obj = o
      }

      var out = ""

      if (Array.isArray(obj)) {
        var out = "\n" + indent + "- " +obj.map(function (item) {
          return encode(item, indent + "  ", true)
        }).join("\n"+indent + "- ")
        break
      }

      // an actual object
      var keys = Object.keys(obj)
        , niceKeys = keys.map(function (k) {
            return (k.match(/^[a-zA-Z0-9_]+$/) ? k : JSON.stringify(k)) + ": "
          })
      //console.error(keys, niceKeys, obj)
      var maxLength = Math.max.apply(Math, niceKeys.map(function (k) {
            return k.length
          }).concat(0))
      //console.error(niceKeys, maxLength)

      var spaces = new Array(maxLength + 1).join(" ")

      if (!deep) indent += "  "
      out = "\n" + indent + keys.map(function (k, i) {
        var niceKey = niceKeys[i]
        return niceKey + spaces.substr(niceKey.length)
                       + encode(obj[k], indent + "  ", true)
      }).join("\n" + indent)
      break

    default: return ""
  }
  if (!deep) seen.length = 0
  return out
}

function decode (str) {
  var v = str.trim()
    , d
    , dateRe = /^\[Date ([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(?::[0-9]{2})?(?:\.[0-9]{3})?(?:[A-Z]+)?)\]$/

  if (v === "~") return null

  try {
    var jp = JSON.parse(str)
  } catch (e) {
    var jp = ""
  }

  if (jp &&
      typeof jp === "string" &&
      (d = jp.match(dateRe)) &&
      (d = Date.parse(d[1]))) {
    return new Date(d)
  }

  if (typeof jp === "boolean") return jp
  if (v && !isNaN(v)) return parseInt(v, 10)

  // something interesting.
  var lines = str.split(/\r?\n/)
  // check if it's some kind of string or something.
  // if the first line is > or | then it's a wrapping indented string.
  // if the first line is blank, and there are many lines,
  // then it's an array or object.
  // otherwise, it's just ""
  var first = lines.shift().trim()
  if (lines.length) lines = undent(lines)
  switch (first) {
    case "|":
      return lines.join("\n")
    case ">":
      return lines.join("\n").split(/\n{2,}/).map(function (l) {
        return l.split(/\n/).join(" ")
      }).join("\n")
    default:
      if (!lines.length) return first
      // array or object.
      // the first line will be either "- value" or "key: value"
      return lines[0].charAt(0) === "-" ? decodeArr(lines) : decodeObj(lines)
  }
}

function decodeArr (lines) {
  var out = []
    , key = 0
    , val = []
  for (var i = 0, l = lines.length; i < l; i ++) {
    // if it starts with a -, then it's a new thing
    var line = lines[i]
    if (line.charAt(0) === "-") {
      if (val.length) {
        out[key ++] = decode(val.join("\n"))
        val.length = 0
      }
      val.push(line.substr(1).trim())
    } else if (line.charAt(0) === " ") {
      val.push(line)
    } else return []
  }
  if (val.length) {
    out[key ++] = decode(val.join("\n"))
  }
  return out
}

function decodeObj (lines) {
  var out = {}
    , val = []
    , key = null

  for (var i = 0, l = lines.length; i < l; i ++) {
    var line = lines[i]
    if (line.charAt(0) === " ") {
      val.push(line)
      continue
    }
    // some key:val
    if (val.length) {
      out[key] = decode(val.join("\n"))
      val.length = 0
    }
    // parse out the quoted key
    var first
    if (line.charAt(0) === "\"") {
      for (var ii = 1, ll = line.length, esc = false; ii < ll; ii ++) {
        var c = line.charAt(ii)
        if (c === "\\") {
          esc = !esc
        } else if (c === "\"" && !esc) {
          break
        }
      }
      key = JSON.parse(line.substr(0, ii + 1))
      line = line.substr(ii + 1)
      first = line.substr(line.indexOf(":") + 1).trim()
    } else {
      var kv = line.split(":")
      key = kv.shift()
      first = kv.join(":").trim()
    }
    // now we've set a key, and "first" has the first line of the value.
    val.push(first.trim())
  }
  if (val.length) out[key] = decode(val.join("\n"))
  return out
}

function undent (lines) {
  var i = lines[0].match(/^\s*/)[0].length
  return lines.map(function (line) {
    return line.substr(i)
  })
}


// XXX Turn this into proper tests.
if (require.main === module) {
var obj = [{"bigstring":new Error().stack}
          ,{ar:[{list:"of"},{some:"objects"}]}
          ,{date:new Date()}
          ,{"super huge string":new Error().stack}
          ]

Date.prototype.toJSON = function (k, val) {
  console.error(k, val, this)
  return this.toISOString() + " (it's a date)"
}

var enc = encode(obj)
  , dec = decode(enc)
  , encDec = encode(dec)

console.error(JSON.stringify({ obj : obj
                             , enc : enc.split(/\n/)
                             , dec : dec }, null, 2), encDec === enc)

var num = 100
  , encNum = encode(num)
  , decEncNum = decode(encNum)
console.error([num, encNum, decEncNum])
}

},{}],15:[function(require,module,exports){var events = require('events');
var util = require('util');

function Stream() {
  events.EventEmitter.call(this);
}
util.inherits(Stream, events.EventEmitter);
module.exports = Stream;
// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once, and
  // only when all sources have ended.
  if (!dest._isStdio && (!options || options.end !== false)) {
    dest._pipeCount = dest._pipeCount || 0;
    dest._pipeCount++;

    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":14,"util":16}],16:[function(require,module,exports){var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":14}],10:[function(require,module,exports){(function(__filename,__dirname){// an assert module that returns tappable data for each assertion.
var difflet = require('difflet')
  , deepEqual = require('deep-equal')
  , bufferEqual = require('buffer-equal')
  , Buffer = require('buffer').Buffer

module.exports = assert

var syns = {}
  , id = 1

function assert (ok, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)

  //console.error("assert %j", [ok, message, extra])
  //if (extra && extra.skip) return assert.skip(message, extra)
  //console.error("assert", [ok, message, extra])
  ok = !!ok
  var res = { id : id ++, ok: ok }

  var caller = getCaller(extra && extra.error)
  if (extra && extra.error) {
    res.type = extra.error.name
    res.message = extra.error.message
    res.code = extra.error.code
             || extra.error.type
    res.errno = extra.error.errno
    delete extra.error
  }
  if (caller.file) {
    res.file = caller.file
    res.line = +caller.line
    res.column = +caller.column
  }
  res.stack = caller.stack

  res.name = message || "(unnamed assert)"

  if (extra) Object.keys(extra).forEach(function (k) {
    if (!res.hasOwnProperty(k)) res[k] = extra[k]
  })

  // strings and objects are hard to diff by eye
  if (!ok &&
      res.hasOwnProperty("found") &&
      res.hasOwnProperty("wanted") &&
      res.found !== res.wanted) {
    if (typeof res.wanted !== typeof res.found ||
        typeof res.wanted === "object" && (!res.found || !res.wanted)) {
      res.type = { found: typeof found
                 , wanted: typeof wanted }
    } else if (typeof res.wanted === "string") {
      res.diff = diffString(res.found, res.wanted)
    } else if (typeof res.wanted === "object") {
      res.diff = diffObject(res.found, res.wanted)
    }
  }

  //console.error("assert return", res)

  return res
}
assert.ok = assert
syns.ok = [ "true", "assert" ]


function notOk (ok, message, extra) {
  return assert(!ok, message, extra)
}
assert.notOk = notOk
syns.notOk = [ "false", "notok" ]

function error (er, message, extra) {
  if (!er) {
    // just like notOk(er)
    return assert(!er, message, extra)
  }
  message = message || er.message
  extra = extra || {}
  extra.error = er
  return assert.fail(message, extra)
}
assert.error = error
syns.error = [ "ifError", "ifErr", "iferror" ]


function pass (message, extra) {
  return assert(true, message, extra)
}
assert.pass = pass

function fail (message, extra) {
  //console.error("assert.fail", [message, extra])
  //if (extra && extra.skip) return assert.skip(message, extra)
  return assert(false, message, extra)
}
assert.fail = fail

function skip (message, extra) {
  //console.error("assert.skip", message, extra)
  if (!extra) extra = {}
  return { id: id ++, skip: true, name: message || "" }
}
assert.skip = skip

function throws (fn, wanted, message, extra) {
  if (typeof wanted === "string") {
    extra = message
    message = wanted
    wanted = null
  }

  if (extra && extra.skip) return assert.skip(message, extra)

  var found = null
  try {
    fn()
  } catch (e) {
    found = { name: e.name, message: e.message }
  }

  extra = extra || {}

  extra.found = found
  if (wanted) {
    wanted = { name: wanted.name, message: wanted.message }
    extra.wanted = wanted
  }

  if (!message) {
    message = "Expected to throw"
    if (wanted) message += ": "+wanted.name + " " + wanted.message
  }

  return (wanted) ? assert.similar(found, wanted, message, extra)
                  : assert.ok(found, message, extra)
}
assert.throws = throws


function doesNotThrow (fn, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)
  var found = null
  try {
    fn()
  } catch (e) {
    found = {name: e.name, message: e.message}
  }
  message = message || "Should not throw"

  return assert.equal(found, null, message, extra)
}
assert.doesNotThrow = doesNotThrow


function equal (a, b, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)
  extra = extra || {}
  message = message || "should be equal"
  extra.found = a
  extra.wanted = b
  return assert(a === b, message, extra)
}
assert.equal = equal
syns.equal = ["equals"
             ,"isEqual"
             ,"is"
             ,"strictEqual"
             ,"strictEquals"]


function equivalent (a, b, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)
  var extra = extra || {}
  message = message || "should be equivalent"
  extra.found = a
  extra.wanted = b

  if (Buffer.isBuffer(a) && Buffer.isBuffer(b)) {
    return assert(bufferEqual(a, b), message, extra)
  } else {
    return assert(deepEqual(a, b), message, extra)
  }
}
assert.equivalent = equivalent
syns.equivalent = ["isEquivalent"
                  ,"looseEqual"
                  ,"looseEquals"
                  ,"isDeeply"
                  ,"same"
                  ,"deepEqual"
                  ,"deepEquals"]


function inequal (a, b, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)
  extra = extra || {}
  message = message || "should not be equal"
  extra.found = a
  extra.doNotWant = b
  return assert(a !== b, message, extra)
}
assert.inequal = inequal
syns.inequal = ["notEqual"
               ,"notEquals"
               ,"notStrictEqual"
               ,"notStrictEquals"
               ,"isNotEqual"
               ,"isNot"
               ,"not"
               ,"doesNotEqual"
               ,"isInequal"]


function inequivalent (a, b, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)
  extra = extra || {}
  message = message || "should not be equivalent"
  extra.found = a
  extra.doNotWant = b
  
  if (Buffer.isBuffer(a) && Buffer.isBuffer(b)) {
    return assert(!bufferEqual(a, b), message, extra)
  } else {
    return assert(!deepEqual(a, b), message, extra)
  }
}
assert.inequivalent = inequivalent
syns.inequivalent = ["notEquivalent"
                    ,"notDeepEqual"
                    ,"notDeeply"
                    ,"notSame"
                    ,"isNotDeepEqual"
                    ,"isNotDeeply"
                    ,"isNotEquivalent"
                    ,"isInequivalent"]

function similar (a, b, message, extra, flip) {
  if (extra && extra.skip) return assert.skip(message, extra)
  // test that a has all the fields in b
  message = message || "should be similar"

  if (typeof a === "string" &&
      (Object.prototype.toString.call(b) === "[object RegExp]")) {
    extra = extra || {}
    extra.pattern = b
    extra.string = a
    var ok = a.match(b)
    extra.match = ok
    if (flip) ok = !ok
    return assert.ok(ok, message, extra)
  }

  var isObj = assert(a && typeof a === "object", message, extra)
  if (!isObj.ok) {
    // not an object
    if (a == b) isObj.ok = true
    if (flip) isObj.ok = !isObj.ok
    return isObj
  }

  var eq = flip ? inequivalent : equivalent
  return eq(selectFields(a, b), b, message, extra)
}
assert.similar = similar
syns.similar = ["isSimilar"
               ,"has"
               ,"hasFields"
               ,"like"
               ,"isLike"]

function dissimilar (a, b, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)
  message = message || "should be dissimilar"
  return similar(a, b, message, extra, true)
}
assert.dissimilar = dissimilar
syns.dissimilar = ["unsimilar"
                  ,"notSimilar"
                  ,"unlike"
                  ,"isUnlike"
                  ,"notLike"
                  ,"isNotLike"
                  ,"doesNotHave"
                  ,"isNotSimilar"
                  ,"isDissimilar"]

function type (thing, t, message, extra) {
  if (extra && extra.skip) return assert.skip(message, extra)
  var name = t
  if (typeof name === "function") name = name.name || "(anonymous ctor)"
  //console.error("name=%s", name)
  message = message || "type is "+name
  var type = typeof thing
  //console.error("type=%s", type)
  if (!thing && type === "object") type = "null"
  if (type === "object" && t !== "object") {
    if (typeof t === "function") {
      //console.error("it is a function!")
      extra = extra || {}
      extra.found = Object.getPrototypeOf(thing).constructor.name
      extra.wanted = name
      //console.error(thing instanceof t, name)
      return assert.ok(thing instanceof t, message, extra)
    }

    //console.error("check prototype chain")
    // check against classnames or objects in prototype chain, as well.
    // type(new Error("asdf"), "Error")
    // type(Object.create(foo), foo)
    var p = thing
    while (p = Object.getPrototypeOf(p)) {
      if (p === t || p.constructor && p.constructor.name === t) {
        type = name
        break
      }
    }
  }
  //console.error(type, name, type === name)
  return assert.equal(type, name, message, extra)
}
assert.type = type
syns.type = ["isa"]

// synonyms are helpful.
Object.keys(syns).forEach(function (c) {
  syns[c].forEach(function (s) {
    Object.defineProperty(assert, s, { value: assert[c], enumerable: false })
  })
})

// helpers below

function selectFields (a, b) {
  // get the values in A of the fields in B
  var ret = Array.isArray(b) ? [] : {}
  Object.keys(b).forEach(function (k) {
    if (!a.hasOwnProperty(k)) return
    var v = b[k]
      , av = a[k]
    if (v && av && typeof v === "object" && typeof av === "object"
       && !(v instanceof Date)
       && !(v instanceof RegExp)
       && !(v instanceof String)
       && !(v instanceof Boolean)
       && !(v instanceof Number)
       && !(Array.isArray(v))) {
      ret[k] = selectFields(av, v)
    } else ret[k] = av
  })
  return ret
}

function sortObject (obj) {
  if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
    return obj
  }
   
  return Object.keys(obj).sort().reduce(function (acc, key) {
    acc[key] = sortObject(obj[key])
    return acc
  }, {})
}

function stringify (a) {
  return JSON.stringify(sortObject(a), (function () {
    var seen = []
      , keys = []
    return function (key, val) {
      var s = seen.indexOf(val)
      if (s !== -1) {
        return "[Circular: "+keys[s]+"]"
      }
      if (val && typeof val === "object" || typeof val === "function") {
        seen.push(val)
        keys.push(val["!"] || val.name || key || "<root>")
        if (typeof val === "function") {
          return val.toString().split(/\n/)[0]
        } else if (typeof val.toUTCString === "function") {
          return val.toUTCString()
        }
      }
      return val
  }})())
}

function diffString (f, w) {
  if (w === f) return null
  var p = 0
    , l = w.length
  while (p < l && w.charAt(p) === f.charAt(p)) p ++
  w = stringify(w).substr(1).replace(/"$/, "")
  f = stringify(f).substr(1).replace(/"$/, "")
  return diff(f, w, p)
}

function diffObject (f, w) {
  return difflet({ indent : 2, comment : true }).compare(w, f)
}

function diff (f, w, p) {
  if (w === f) return null
  var i = p || 0 // it's going to be at least p. JSON can only be bigger.
    , l = w.length
  while (i < l && w.charAt(i) === f.charAt(i)) i ++
  var pos = Math.max(0, i - 20)
  w = w.substr(pos, 40)
  f = f.substr(pos, 40)
  var pointer = i - pos
  return "FOUND:  "+f+"\n"
       + "WANTED: "+w+"\n"
       + (new Array(pointer + 9).join(" "))
       + "^ (at position = "+p+")"
}

function getCaller (er) {
  // get the first file/line that isn't this file.
  if (!er) er = new Error
  var stack = er.stack || ""
  stack = stack.split(/\n/)
  for (var i = 1, l = stack.length; i < l; i ++) {
    var s = stack[i].match(/\(([^):]+):([0-9]+):([0-9]+)\)$/)
    if (!s) continue
    var file = s[1]
      , line = +s[2]
      , col = +s[3]
    if (file.indexOf(__dirname) === 0) continue
    if (file.match(/tap-test\/test.js$/)) continue
    else break
  }
  var res = {}
  if (file && file !== __filename && !file.match(/tap-test\/test.js$/)) {
    res.file = file
    res.line = line
    res.column = col
  }

  res.stack = stack.slice(1).map(function (s) {
    return s.replace(/^\s*at\s*/, "")
  })

  return res
}



})("/node_modules/tap/lib/tap-assert.js","/node_modules/tap/lib")
},{"difflet":17,"deep-equal":18,"buffer-equal":19,"buffer":20}],17:[function(require,module,exports){(function(process){var traverse = require('traverse');
var Stream = require('stream').Stream;
var charm = require('charm');
var deepEqual = require('deep-equal');

var exports = module.exports = function (opts_) {
    var fn = difflet.bind(null, opts_);
    fn.compare = function (prev, next) {
        var opts = Object.keys(opts_ || {}).reduce(function (acc, key) {
            acc[key] = opts_[key];
            return acc;
        }, {});
        var s = opts.stream = new Stream;
        var data = '';
        s.write = function (buf) { data += buf };
        s.end = function () {};
        s.readable = true;
        s.writable = true;
        
        difflet(opts, prev, next);
        return data;
    };
    return fn;
};

exports.compare = function (prev, next) {
    return exports({}).compare(prev, next);
};

function difflet (opts, prev, next) {
    var stream = opts.stream || new Stream;
    if (!opts.stream) {
        stream.readable = true;
        stream.writable = true;
        stream.write = function (buf) { this.emit('data', buf) };
        stream.end = function () { this.emit('end') };
    }
    
    if (!opts) opts = {};
    if (opts.start === undefined && opts.stop === undefined) {
        var c = charm(stream);
        opts.start = function (type) {
            c.foreground({
                inserted : 'green',
                updated : 'blue',
                deleted : 'red',
                comment : 'cyan',
            }[type]);
            c.display('bright');
        };
        opts.stop = function (type) {
            c.display('reset');
        };
    }
    var write = function (buf) {
        if (opts.write) opts.write(buf, stream)
        else stream.write(buf)
    };
    
    var commaFirst = opts.comma === 'first';
    
    var stringify = function (node, params) {
        return stringifier.call(this, true, node, params || opts);
    };
    var plainStringify = function (node, params) {
        return stringifier.call(this, false, node, params || opts);
    };
    
    var levels = 0;
    function set (type) {
        if (levels === 0) opts.start(type, stream);
        levels ++;
    }
    
    function unset (type) {
        if (--levels === 0) opts.stop(type, stream);
    }
    
    function stringifier (insertable, node, opts) {
        var indent = opts.indent;
        
        if (insertable) {
            var prevNode = traverse.get(prev, this.path || []);
        }
        var inserted = insertable && prevNode === undefined;
        
        var indentx = indent ? Array(
            ((this.path || []).length + 1) * indent + 1
        ).join(' ') : '';
        if (commaFirst) indentx = indentx.slice(indent);
        
        if (Array.isArray(node)) {
            var updated = (prevNode || traverse.has(prev, this.path))
                && !Array.isArray(prevNode);
            if (updated) {
                set('updated');
            }
            
            if (opts.comment && !Array.isArray(prevNode)) {
                indent = 0;
            }
            
            this.before(function () {
                if (inserted) set('inserted');
                if (indent && commaFirst) {
                    if ((this.path || []).length === 0
                    || Array.isArray(this.parent.node)) {
                        write('[ ');
                    }
                    else write('\n' + indentx + '[ ');
                }
                else if (indent) {
                    write('[\n' + indentx);
                }
                else {
                    write('[');
                }
            });
            
            this.post(function (child) {
                if (!child.isLast && !(indent && commaFirst)) {
                    write(',');
                }
                
                var prev = prevNode && prevNode[child.key];
                if (indent && opts.comment && child.node !== prev
                && (typeof child.node !== 'object' || typeof prev !== 'object')
                ) {
                    set('comment');
                    write(' // != ');
                    traverse(prev).forEach(function (x) {
                        plainStringify.call(this, x, { indent : 0 });
                    });
                    unset('comment');
                }
                
                if (!child.isLast) {
                    if (indent && commaFirst) {
                        write('\n' + indentx + ', ');
                    }
                    else if (indent) {
                        write('\n' + indentx);
                    }
                }
            });
            
            this.after(function () {
                if (indent && commaFirst) write('\n' + indentx);
                else if (indent) write('\n' + indentx.slice(indent));
                
                write(']');
                if (updated) unset('updated');
                if (inserted) unset('inserted');
            });
        }
        else if (isRegExp(node)) {
            this.block();
            
            if (inserted) {
                set('inserted');
                write(node.toString());
                unset('inserted');
            }
            else if (insertable && prevNode !== node) {
                set('updated');
                write(node.toString());
                unset('updated');
            }
            else write(node.toString());
        }
        else if (typeof node === 'object'
        && node && typeof node.inspect === 'function') {
            this.block();
            if (inserted) {
                set('inserted');
                write(node.inspect());
                unset('inserted');
            }
            else if (!(prevNode && typeof prevNode.inspect === 'function'
            && prevNode.inspect() === node.inspect())) {
                set('updated');
                write(node.inspect());
                unset('updated');
            }
            else write(node.inspect());
        }
        else if (typeof node == 'object' && node !== null) {
            var insertedKey = false;
            var deleted = insertable && typeof prevNode === 'object' && prevNode
                ? Object.keys(prevNode).filter(function (key) {
                    return !Object.hasOwnProperty.call(node, key);
                })
                : []
            ;
            
            this.before(function () {
                if (inserted) set('inserted');
                write(indent && commaFirst && !this.isRoot
                    ? '\n' + indentx + '{ '
                    : '{'
                );
            });
            
            this.pre(function (x, key) {
                if (insertable) {
                    var obj = traverse.get(prev, this.path.concat(key));
                    if (obj === undefined) {
                        insertedKey = true;
                        set('inserted');
                    }
                }
                
                if (indent && !commaFirst) write('\n' + indentx);
                
                plainStringify(key);
                write(indent ? ' : ' : ':');
            });
            
            this.post(function (child) {
                if (!child.isLast && !(indent && commaFirst)) {
                    write(',');
                }
                
                if (child.isLast && deleted.length) {
                    if (insertedKey) unset('inserted');
                    insertedKey = false;
                }
                else if (insertedKey) {
                    unset('inserted');
                    insertedKey = false;
                }
                
                var prev = prevNode && prevNode[child.key];
                if (indent && opts.comment && child.node !== prev
                && (typeof child.node !== 'object' || typeof prev !== 'object')
                ) {
                    set('comment');
                    write(' // != ');
                    traverse(prev).forEach(function (x) {
                        plainStringify.call(this, x, { indent : 0 });
                    });
                    unset('comment');
                }
                
                if (child.isLast && deleted.length) {
                    if (insertedKey) unset('inserted');
                    insertedKey = false;
                    
                    if (indent && commaFirst) {
                        write('\n' + indentx + ', ')
                    }
                    else if (opts.comment && indent) {
                        write('\n' + indentx);
                    }
                    else if (indent) {
                        write(',\n' + indentx);
                    }
                    else write(',');
                }
                else {
                    if (!child.isLast) {
                        if (indent && commaFirst) {
                            write('\n' + indentx + ', ');
                        }
                    }
                }
            });
            
            this.after(function () {
                if (inserted) unset('inserted');
                
                if (deleted.length) {
                    if (indent && !commaFirst
                    && Object.keys(node).length === 0) {
                        write('\n' + indentx);
                    }
                    
                    set('deleted');
                    deleted.forEach(function (key, ix) {
                        if (indent && opts.comment) {
                            unset('deleted');
                            set('comment');
                            write('// ');
                            unset('comment');
                            set('deleted');
                        }
                        
                        plainStringify(key);
                        write(indent ? ' : ' : ':');
                        traverse(prevNode[key]).forEach(function (x) {
                            plainStringify.call(this, x, { indent : 0 });
                        });
                        
                        var last = ix === deleted.length - 1;
                        if (insertable && !last) {
                            if (indent && commaFirst) {
                                write('\n' + indentx + ', ');
                            }
                            else if (indent) {
                                write(',\n' + indentx);
                            }
                            else write(',');
                        }
                    });
                    unset('deleted');
                }
                
                if (commaFirst && indent) {
                    write(indentx.slice(indent) + ' }');
                }
                else if (indent) {
                    write('\n' + indentx.slice(indent) + '}');
                }
                else write('}');
            });
        }
        else {
            var changed = false;
            
            if (inserted) set('inserted');
            else if (insertable && !deepEqual(prevNode, node)) {
                changed = true;
                set('updated');
            }
            
            if (typeof node === 'string') {
                write('"' + node.toString().replace(/"/g, '\\"') + '"');
            }
            else if (isRegExp(node)) {
                write(node.toString());
            }
            else if (typeof node === 'function') {
                write(node.name
                    ? '[Function: ' + node.name + ']'
                    : '[Function]'
                );
            }
            else if (node === undefined) {
                write('undefined');
            }
            else if (node === null) {
                write('null');
            }
            else {
                write(node.toString());
            }
            
            if (inserted) unset('inserted');
            else if (changed) unset('updated');
        }
    }
    
    if (opts.stream) {
        traverse(next).forEach(stringify);
    }
    else process.nextTick(function () {
        traverse(next).forEach(stringify);
        stream.emit('end');
    });
    
    return stream;
}

function isRegExp (node) {
    return node instanceof RegExp || (node
        && typeof node.test === 'function' 
        && typeof node.exec === 'function'
        && typeof node.compile === 'function'
        && node.constructor && node.constructor.name === 'RegExp'
    );
}

})(require("__browserify_process"))
},{"traverse":21,"stream":15,"charm":22,"deep-equal":18,"__browserify_process":13}],21:[function(require,module,exports){var traverse = module.exports = function (obj) {
    return new Traverse(obj);
};

function Traverse (obj) {
    this.value = obj;
}

Traverse.prototype.get = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) {
            node = undefined;
            break;
        }
        node = node[key];
    }
    return node;
};

Traverse.prototype.has = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) {
            return false;
        }
        node = node[key];
    }
    return true;
};

Traverse.prototype.set = function (ps, value) {
    var node = this.value;
    for (var i = 0; i < ps.length - 1; i ++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) node[key] = {};
        node = node[key];
    }
    node[ps[i]] = value;
    return value;
};

Traverse.prototype.map = function (cb) {
    return walk(this.value, cb, true);
};

Traverse.prototype.forEach = function (cb) {
    this.value = walk(this.value, cb, false);
    return this.value;
};

Traverse.prototype.reduce = function (cb, init) {
    var skip = arguments.length === 1;
    var acc = skip ? this.value : init;
    this.forEach(function (x) {
        if (!this.isRoot || !skip) {
            acc = cb.call(this, acc, x);
        }
    });
    return acc;
};

Traverse.prototype.paths = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.path); 
    });
    return acc;
};

Traverse.prototype.nodes = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.node);
    });
    return acc;
};

Traverse.prototype.clone = function () {
    var parents = [], nodes = [];
    
    return (function clone (src) {
        for (var i = 0; i < parents.length; i++) {
            if (parents[i] === src) {
                return nodes[i];
            }
        }
        
        if (typeof src === 'object' && src !== null) {
            var dst = copy(src);
            
            parents.push(src);
            nodes.push(dst);
            
            forEach(objectKeys(src), function (key) {
                dst[key] = clone(src[key]);
            });
            
            parents.pop();
            nodes.pop();
            return dst;
        }
        else {
            return src;
        }
    })(this.value);
};

function walk (root, cb, immutable) {
    var path = [];
    var parents = [];
    var alive = true;
    
    return (function walker (node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        
        var keepGoing = true;
        
        var state = {
            node : node,
            node_ : node_,
            path : [].concat(path),
            parent : parents[parents.length - 1],
            parents : parents,
            key : path.slice(-1)[0],
            isRoot : path.length === 0,
            level : path.length,
            circular : null,
            update : function (x, stopHere) {
                if (!state.isRoot) {
                    state.parent.node[state.key] = x;
                }
                state.node = x;
                if (stopHere) keepGoing = false;
            },
            'delete' : function (stopHere) {
                delete state.parent.node[state.key];
                if (stopHere) keepGoing = false;
            },
            remove : function (stopHere) {
                if (isArray(state.parent.node)) {
                    state.parent.node.splice(state.key, 1);
                }
                else {
                    delete state.parent.node[state.key];
                }
                if (stopHere) keepGoing = false;
            },
            keys : null,
            before : function (f) { modifiers.before = f },
            after : function (f) { modifiers.after = f },
            pre : function (f) { modifiers.pre = f },
            post : function (f) { modifiers.post = f },
            stop : function () { alive = false },
            block : function () { keepGoing = false }
        };
        
        if (!alive) return state;
        
        function updateState() {
            if (typeof state.node === 'object' && state.node !== null) {
                if (!state.keys || state.node_ !== state.node) {
                    state.keys = objectKeys(state.node)
                }
                
                state.isLeaf = state.keys.length == 0;
                
                for (var i = 0; i < parents.length; i++) {
                    if (parents[i].node_ === node_) {
                        state.circular = parents[i];
                        break;
                    }
                }
            }
            else {
                state.isLeaf = true;
                state.keys = null;
            }
            
            state.notLeaf = !state.isLeaf;
            state.notRoot = !state.isRoot;
        }
        
        updateState();
        
        // use return values to update if defined
        var ret = cb.call(state, state.node);
        if (ret !== undefined && state.update) state.update(ret);
        
        if (modifiers.before) modifiers.before.call(state, state.node);
        
        if (!keepGoing) return state;
        
        if (typeof state.node == 'object'
        && state.node !== null && !state.circular) {
            parents.push(state);
            
            updateState();
            
            forEach(state.keys, function (key, i) {
                path.push(key);
                
                if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
                
                var child = walker(state.node[key]);
                if (immutable && Object.hasOwnProperty.call(state.node, key)) {
                    state.node[key] = child.node;
                }
                
                child.isLast = i == state.keys.length - 1;
                child.isFirst = i == 0;
                
                if (modifiers.post) modifiers.post.call(state, child);
                
                path.pop();
            });
            parents.pop();
        }
        
        if (modifiers.after) modifiers.after.call(state, state.node);
        
        return state;
    })(root).node;
}

function copy (src) {
    if (typeof src === 'object' && src !== null) {
        var dst;
        
        if (isArray(src)) {
            dst = [];
        }
        else if (isDate(src)) {
            dst = new Date(src);
        }
        else if (isRegExp(src)) {
            dst = new RegExp(src);
        }
        else if (isError(src)) {
            dst = { message: src.message };
        }
        else if (isBoolean(src)) {
            dst = new Boolean(src);
        }
        else if (isNumber(src)) {
            dst = new Number(src);
        }
        else if (isString(src)) {
            dst = new String(src);
        }
        else if (Object.create && Object.getPrototypeOf) {
            dst = Object.create(Object.getPrototypeOf(src));
        }
        else if (src.constructor === Object) {
            dst = {};
        }
        else {
            var proto =
                (src.constructor && src.constructor.prototype)
                || src.__proto__
                || {}
            ;
            var T = function () {};
            T.prototype = proto;
            dst = new T;
        }
        
        forEach(objectKeys(src), function (key) {
            dst[key] = src[key];
        });
        return dst;
    }
    else return src;
}

var objectKeys = Object.keys || function keys (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

function toS (obj) { return Object.prototype.toString.call(obj) }
function isDate (obj) { return toS(obj) === '[object Date]' }
function isRegExp (obj) { return toS(obj) === '[object RegExp]' }
function isError (obj) { return toS(obj) === '[object Error]' }
function isBoolean (obj) { return toS(obj) === '[object Boolean]' }
function isNumber (obj) { return toS(obj) === '[object Number]' }
function isString (obj) { return toS(obj) === '[object String]' }

var isArray = Array.isArray || function isArray (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

forEach(objectKeys(Traverse.prototype), function (key) {
    traverse[key] = function (obj) {
        var args = [].slice.call(arguments, 1);
        var t = new Traverse(obj);
        return t[key].apply(t, args);
    };
});

},{}],22:[function(require,module,exports){(function(process){var tty = require('tty');
var encode = require('./lib/encode');
var EventEmitter = require('events').EventEmitter;

var exports = module.exports = function () {
    var input = null;
    function setInput (s) {
        if (input) throw new Error('multiple inputs specified')
        else input = s
    }
    
    var output = null;
    function setOutput (s) {
        if (output) throw new Error('multiple outputs specified')
        else output = s
    }
    
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (!arg) continue;
        if (arg.readable) setInput(arg)
        else if (arg.stdin || arg.input) setInput(arg.stdin || arg.input)
        
        if (arg.writable) setOutput(arg)
        else if (arg.stdout || arg.output) setOutput(arg.stdout || arg.output)
        
    }
    
    return new Charm(input, output);
};

var Charm = exports.Charm = function (input, output) {
    var self = this;
    self.input = input;
    self.output = output;
    self.pending = [];
    
    if (!output) {
        self.emit('error', new Error('output stream required'));
    }
    
    if (input && typeof input.fd === 'number' && tty.isatty(input.fd)) {
        if (process.stdin.setRawMode) {
            process.stdin.setRawMode(true);
        }
        else tty.setRawMode(true);
        input.resume();
    }
    
    if (input) {
        input.on('data', function (buf) {
            if (self.pending.length) {
                var codes = extractCodes(buf);
                var matched = false;
                
                for (var i = 0; i < codes.length; i++) {
                    for (var j = 0; j < self.pending.length; j++) {
                        var cb = self.pending[j];
                        if (cb(codes[i])) {
                            matched = true;
                            self.pending.splice(j, 1);
                            break;
                        }
                    }
                }
                
                if (matched) return;
            }
            
            self.emit('data', buf)
            
            if (buf.length === 1) {
                if (buf[0] === 3) self.emit('^C');
                if (buf[0] === 4) self.emit('^D');
            }
        });
    }
}

Charm.prototype = new EventEmitter;

Charm.prototype.destroy = function () {
    if (this.input) this.input.destroy()
};

Charm.prototype.write = function (msg) {
    this.output.write(msg);
    return this;
};

Charm.prototype.reset = function (cb) {
    this.write(encode('c'));
    return this;
};

Charm.prototype.position = function (x, y) {
    // get/set absolute coordinates
    if (typeof x === 'function') {
        var cb = x;
        this.pending.push(function (buf) {
            if (buf[0] === 27 && buf[1] === encode.ord('[')
            && buf[buf.length-1] === encode.ord('R')) {
                var pos = buf.toString()
                    .slice(2,-1)
                    .split(';')
                    .map(Number)
                ;
                cb(pos[1], pos[0]);
                return true;
            }
        });
        this.write(encode('[6n'));
    }
    else {
        this.write(encode(
            '[' + Math.floor(y) + ';' + Math.floor(x) + 'f'
        ));
    }
    return this;
};

Charm.prototype.move = function (x, y) {
    // set relative coordinates
    var bufs = [];
    
    if (y < 0) this.up(-y)
    else if (y > 0) this.down(y)
    
    if (x > 0) this.right(x)
    else if (x < 0) this.left(-x)
    
    return this;
};

Charm.prototype.up = function (y) {
    if (y === undefined) y = 1;
    this.write(encode('[' + Math.floor(y) + 'A'));
    return this;
};

Charm.prototype.down = function (y) {
    if (y === undefined) y = 1;
    this.write(encode('[' + Math.floor(y) + 'B'));
    return this;
};

Charm.prototype.right = function (x) {
    if (x === undefined) x = 1;
    this.write(encode('[' + Math.floor(x) + 'C'));
    return this;
};

Charm.prototype.left = function (x) {
    if (x === undefined) x = 1;
    this.write(encode('[' + Math.floor(x) + 'D'));
    return this;
};

Charm.prototype.column = function (x) {
    this.write(encode('[' + Math.floor(x) + 'G'));
    return this;
};

Charm.prototype.push = function (withAttributes) {
    this.write(encode(withAttributes ? '7' : '[s'));
    return this;
};

Charm.prototype.pop = function (withAttributes) {
    this.write(encode(withAttributes ? '8' : '[u'));
    return this;
};

Charm.prototype.erase = function (s) {
    if (s === 'end' || s === '$') {
        this.write(encode('[K'));
    }
    else if (s === 'start' || s === '^') {
        this.write(encode('[1K'));
    }
    else if (s === 'line') {
        this.write(encode('[2K'));
    }
    else if (s === 'down') {
        this.write(encode('[J'));
    }
    else if (s === 'up') {
        this.write(encode('[1J'));
    }
    else if (s === 'screen') {
        this.write(encode('[1J'));
    }
    else {
        this.emit('error', new Error('Unknown erase type: ' + s));
    }
    return this;
};

Charm.prototype.display = function (attr) {
    var c = {
        reset : 0,
        bright : 1,
        dim : 2,
        underscore : 4,
        blink : 5,
        reverse : 7,
        hidden : 8
    }[attr];
    if (c === undefined) {
        this.emit('error', new Error('Unknown attribute: ' + attr));
    }
    this.write(encode('[' + c + 'm'));
    return this;
};

Charm.prototype.foreground = function (color) {
    if (typeof color === 'number') {
        if (color < 0 || color >= 256) {
            this.emit('error', new Error('Color out of range: ' + color));
        }
        this.write(encode('[38;5;' + color + 'm'));
    }
    else {
        var c = {
            black : 30,
            red : 31,
            green : 32,
            yellow : 33,
            blue : 34,
            magenta : 35,
            cyan : 36,
            white : 37
        }[color.toLowerCase()];
        
        if (!c) this.emit('error', new Error('Unknown color: ' + color));
        this.write(encode('[' + c + 'm'));
    }
    return this;
};

Charm.prototype.background = function (color) {
    if (typeof color === 'number') {
        if (color < 0 || color >= 256) {
            this.emit('error', new Error('Color out of range: ' + color));
        }
        this.write(encode('[48;5;' + color + 'm'));
    }
    else {
        var c = {
          black : 40,
          red : 41,
          green : 42,
          yellow : 43,
          blue : 44,
          magenta : 45,
          cyan : 46,
          white : 47
        }[color.toLowerCase()];
        
        if (!c) this.emit('error', new Error('Unknown color: ' + color));
        this.write(encode('[' + c + 'm'));
    }
    return this;
};

Charm.prototype.cursor = function (visible) {
    this.write(encode(visible ? '[?25h' : '[?25l'));
    return this;
};

var extractCodes = exports.extractCodes = function (buf) {
    var codes = [];
    var start = -1;
    
    for (var i = 0; i < buf.length; i++) {
        if (buf[i] === 27) {
            if (start >= 0) codes.push(buf.slice(start, i));
            start = i;
        }
        else if (start >= 0 && i === buf.length - 1) {
            codes.push(buf.slice(start));
        }
    }
    
    return codes;
}

})(require("__browserify_process"))
},{"tty":23,"./lib/encode":24,"events":14,"__browserify_process":13}],23:[function(require,module,exports){exports.isatty = function () {};
exports.setRawMode = function () {};

},{}],24:[function(require,module,exports){var encode = module.exports = function (xs) {
    function bytes (s) {
        if (typeof s === 'string') {
            return s.split('').map(ord);
        }
        else if (Array.isArray(s)) {
            return s.reduce(function (acc, c) {
                return acc.concat(bytes(c));
            }, []);
        }
    }
    
    return new Buffer([ 0x1b ].concat(bytes(xs)));
};

var ord = encode.ord = function ord (c) {
    return c.charCodeAt(0)
};

},{}],18:[function(require,module,exports){var pSlice = Array.prototype.slice;
var Object_keys = typeof Object.keys === 'function'
    ? Object.keys
    : function (obj) {
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }
;

var deepEqual = module.exports = function (actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b);
  }
  try {
    var ka = Object_keys(a),
        kb = Object_keys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

},{}],19:[function(require,module,exports){var Buffer = require('buffer').Buffer; // for use with browserify

module.exports = function (a, b) {
    if (!Buffer.isBuffer(a)) return undefined;
    if (!Buffer.isBuffer(b)) return undefined;
    if (a.length !== b.length) return false;
    
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    
    return true;
};

},{"buffer":20}],20:[function(require,module,exports){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        this.parent[i + this.offset] = subject[i];
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    val |= buffer.parent[buffer.offset + offset + 1];
  } else {
    val = buffer.parent[buffer.offset + offset];
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset + 1] << 16;
    val |= buffer.parent[buffer.offset + offset + 2] << 8;
    val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    val = buffer.parent[buffer.offset + offset + 2] << 16;
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  buffer.parent[buffer.offset + offset] = value;
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
  } else {
    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset] = value & 0x00ff;
  }
}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
  } else {
    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset] = value & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

},{"assert":25,"base64-js":26,"./buffer_ieee754":27}],25:[function(require,module,exports){// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

},{"util":16,"buffer":20}],26:[function(require,module,exports){(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],27:[function(require,module,exports){exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],7:[function(require,module,exports){(function(process){// This is a very simple test framework that leverages the tap framework
// to run tests and output tap-parseable results.

module.exports = Test

var assert = require("./tap-assert")
  , inherits = require("inherits")
  , Results = require("./tap-results")

// tests are also test harnesses
inherits(Test, require("./tap-harness"))

function Test (harness, name, conf) {
  //console.error("test ctor")
  if (!(this instanceof Test)) return new Test(harness, name, conf)

  Test.super.call(this, Test)

  conf.name = name || conf.name || "(anonymous)"
  this.conf = conf

  this.harness = harness
  this.harness.add(this)
}

// it's taking too long!
Test.prototype.timeout = function () {
  // detect false alarms
  if (this._ended) return
  this.fail("Timeout!")
  this.end()
}

Test.prototype.clear = function () {
  this._started = false
  this._ended = false
  this._plan = null
  this._bailedOut = false
  this._testCount = 0
  this.results = new Results()
}

// this gets called if a test throws ever
Test.prototype.threw = function (ex) {
  //console.error("threw!", ex.stack)
  this.fail(ex.name + ": " + ex.message, { error: ex, thrown: true })
  // may emit further failing tests if the plan is not completed
  //console.error("end, because it threw")
  if (!this._ended) this.end()
}

Test.prototype.comment = function (m) {
  if (typeof m !== "string") {
    return this.fail("Test.comment argument must be a string")
  }
  this.result("\n" + m.trim())
}

Test.prototype.result = function (res) {
  this.results.add(res)
  this._testCount ++
  this.emit("result", res)
  if (this._plan === this._testCount) {
    process.nextTick(this._endNice.bind(this))
  }
}

Test.prototype._endNice = function () {
  if (!this._ended) this.end()
}

// parasitic
// Who says you can't do multiple inheritance in js?
Object.getOwnPropertyNames(assert).forEach(function (k) {
  if (k === "prototype" || k === "name") return
  var d = Object.getOwnPropertyDescriptor(assert, k)
    , v = d.value
  if (!v) return
  d.value = assertParasite(v)
  Object.defineProperty(Test.prototype, k, d)
})

function assertParasite (fn) { return function _testAssert () {
  //console.error("_testAssert", fn.name, arguments)
  if (this._bailedOut) return
  var res = fn.apply(assert, arguments)
  this.result(res)
  return res
}}

// a few tweaks on the EE emit function, because
// we want to catch all thrown errors and bubble up "bailout"
Test.prototype.emit = (function (em) { return function (t) {
  // bailouts bubble until handled
  if (t === "bailout" &&
      this.listeners(t).length === 0 &&
      this.harness) {
    return this.harness.bailout(arguments[1])
  }

  if (t === "error") return em.apply(this, arguments)
  try {
    em.apply(this, arguments)
  } catch (ex) {
    // any exceptions in a test are a failure
    //console.error("caught!", ex.stack)
    this.threw(ex)
  }
}})(Test.super.prototype.emit)

})(require("__browserify_process"))
},{"./tap-assert":10,"inherits":11,"./tap-results":12,"./tap-harness":8,"__browserify_process":13}],5:[function(require,module,exports){module.exports = TapConsumer

// pipe a stream into this that's emitting tap-formatted data,
// and it'll emit "data" events with test objects or comment strings
// and an "end" event with the final results.

var yamlish = require("yamlish")
  , Results = require("./tap-results")
  , inherits = require("inherits")

TapConsumer.decode = TapConsumer.parse = function (str) {
  var tc = new TapConsumer
    , list = []
  tc.on("data", function (res) {
    list.push(res)
  })
  tc.end(str)
  tc.results.list = list
  return tc.results
}

inherits(TapConsumer, require("stream").Stream)
function TapConsumer () {
  if (!(this instanceof TapConsumer)) {
    return new TapConsumer
  }

  TapConsumer.super.call(this)
  this.results = new Results
  this.readable = this.writable = true

  this.on("data", function (res) {
    if (typeof res === "object") this.results.add(res)
  })

  this._plan = null
  this._buffer = ""
  this._indent = []
  this._current = null
  this._actualCount = 0
  this._passed = []
  this._failed = []
  //console.error("TapConsumer ctor done")
}

TapConsumer.prototype.bailedOut = false

TapConsumer.prototype.write = function (chunk) {
  if (!this.writable) this.emit("error", new Error("not writable"))
  if (this.bailedOut) return true

  this._buffer = this._buffer + chunk
  // split it up into lines.
  var lines = this._buffer.split(/\r?\n/)
  // ignore the last line, since it might be incomplete.
  this._buffer = lines.pop()

  for (var i = 0, l = lines.length; i < l; i ++) {
    //console.error([i, lines[i]])
    // see if it's indented.
    var line = lines[i]
      , spaces = (this._indent.length && !line.trim())
               || line.match(/^\s/)
    // at this level, only interested in fully undented stuff.
    if (spaces) {
      var c = i
      while (c < l && (!lines[c].trim() || lines[c].match(/^\s/))) {
        this._indent.push(lines[c++])
      }
      //console.error(c-i, "indented", this._indent, this._current)
      i = c - 1
      continue
    }
    // some kind of line.  summary, ok, notok, comment, or garbage.
    // this also finishes parsing any of the indented lines from before
    this._parseLine(line)
  }
  return true
}

TapConsumer.prototype.end = function () {
  // finish up any hanging indented sections or final buffer
  if (this._buffer.match(/^\s/)) this._indent.push(this.buffer)
  else this._parseLine(this._buffer)

  if (!this.bailedOut &&
      this._plan !== null &&
      this.results.testsTotal !== this._plan) {
    while (this._actualCount < this._plan) {
      this.emit("data", {ok: false, name:"MISSING TEST",
                         id:this._actualCount ++ })
    }
  }

  this._parseLine("")
  this._buffer = ""
  this.writable = false
  this.emit("end", null, this._actualCount, this._passed)
}

TapConsumer.prototype._parseLine = function (line) {
  if (this.bailedOut) return
  //console.error("_parseLine", [line])
  // if there are any indented lines, and there is a
  // current object already, then they belong to it.
  // if there is not a current object, then they're garbage.
  if (this._current && this._indent.length) {
    this._parseIndented()
  }
  this._indent.length = 0
  if (this._current) {
    if (this._current.ok) this._passed.push(this._current.id)
    else this._failed.push(this._current.id)
    this.emit("data", this._current)
  }
  this._current = null
  line = line.trim()
  if (!line) return
  // try to see what kind of line this is.

  var bo
  if (bo = line.match(/^bail out!\s*(.*)$/i)) {
    this.bailedOut = true
    // this.emit("error", new Error(line))
    this.emit("bailout", bo[1])
    return
  }

  if (line.match(/^#/)) { // just a comment
    line = line.replace(/^#+/, "").trim()
    // console.error("outputting comment", [line])
    if (line) this.emit("data", line)
    return
  }

  var plan = line.match(/^([0-9]+)\.\.([0-9]+)(?:\s+#(.*))?$/)
  if (plan) {
    var start = +(plan[1])
      , end = +(plan[2])
      , comment = plan[3]

    // TODO: maybe do something else with this?
    // it might be something like: "1..0 #Skip because of reasons"
    this._plan = end
    this.emit("plan", end, comment)
    // plan must come before or after all tests.
    if (this._actualCount !== 0) {
      this._sawPlan = true
    }
    return
  }

  if (line.match(/^(not )?ok(?:\s+([0-9]+))?/)) {
    this._parseResultLine(line)
    return
  }

  // garbage.  emit as a comment.
  //console.error("emitting", [line.trim()])
  if (line.trim()) this.emit("data", line.trim())
}

TapConsumer.prototype._parseDirective = function (line) {
  line = line.trim()
  if (line.match(/^TODO\b/i)) {
    return { todo:true, explanation: line.replace(/^TODO\s*/i, "") }
  } else if (line.match(/^SKIP\b/i)) {
    return { skip:true, explanation: line.replace(/^SKIP\s*/i, "") }
  }
}

TapConsumer.prototype._parseResultLine = function (line) {
  this._actualCount ++
  if (this._sawPlan) {
    this.emit("data", {ok: false, name:"plan in the middle of tests"
                      ,id:this._actualCount ++})
  }
  var parsed = line.match(/^(not )?ok(?: ([0-9]+))?(?:(?: - )?(.*))?$/)
    , ok = !parsed[1]
    , id = +(parsed[2] || this._actualCount)
    , rest = parsed[3] || ""
    , name
    , res = { id:id, ok:ok }

  // split on un-escaped # characters

  //console.log("# "+JSON.stringify([name, rest]))
  rest = rest.replace(/([^\\])((?:\\\\)*)#/g, "$1\n$2").split("\n")
  name = rest.shift()
  rest = rest.filter(function (r) { return r.trim() }).join("#")
  //console.log("# "+JSON.stringify([name, rest]))

  // now, let's see if there's a directive in there.
  var dir = this._parseDirective(rest.trim())
  if (!dir) name += rest ? "#" + rest : ""
  else {
    res.ok = true
    if (dir.skip) res.skip = true
    else if (dir.todo) res.todo = true
    if (dir.explanation) res.explanation = dir.explanation
  }
  res.name = name

  //console.error(line, [ok, id, name])
  this._current = res
}

TapConsumer.prototype._parseIndented = function () {
  // pull yamlish block out
  var ind = this._indent
    , ys
    , ye
    , yind
    , diag
  //console.error(ind, this._indent)
  for (var i = 0, l = ind.length; i < l; i ++) {
    var line = ind[i]
    if (line === undefined) continue
    var lt = line.trim()

    if (!ys) {
      ys = line.match(/^(\s*)---(.*)$/)
      if (ys) {
        yind = ys[1]
        diag = [ys[2]]
        //console.error([line,ys, diag])
        continue
      } else if (lt) this.emit("data", lt)
    } else if (ys && !ye) {
      if (line === yind + "...") ye = true
      else {
        diag.push(line.substr(yind.length))
      }
    } else if (ys && ye && lt) this.emit("data", lt)
  }
  if (diag) {
    //console.error('about to parse', diag)
    diag = yamlish.decode(diag.join("\n"))
    //console.error('parsed', diag)
    Object.keys(diag).forEach(function (k) {
      //console.error(this._current, k)
      if (!this._current.hasOwnProperty(k)) this._current[k] = diag[k]
    }, this)
  }
}

},{"yamlish":6,"./tap-results":12,"inherits":11,"stream":15}],9:[function(require,module,exports){(function(process){var fs = require("fs")
  , child_process = require("child_process")
  , path = require("path")
  , chain = require("slide").chain
  , asyncMap = require("slide").asyncMap
  , TapProducer = require("./tap-producer.js")
  , TapConsumer = require("./tap-consumer.js")
  , assert = require("./tap-assert.js")
  , inherits = require("inherits")
  , util = require("util")
  , CovHtml = require("./tap-cov-html.js")
  , glob = require("glob")

  // XXX Clean up the coverage options
  , doCoverage = process.env.TAP_COV
               || process.env.npm_package_config_coverage
               || process.env.npm_config_coverage

module.exports = Runner

inherits(Runner, TapProducer)

function Runner (options, cb) {
  this.options = options

  var diag = this.options.diag
  var dir = this.options.argv.remain
  Runner.super.call(this, diag)

  this.doCoverage = doCoverage
  // An array of full paths to files to obtain coverage
  this.coverageFiles = []
  // The source of these files
  this.coverageFilesSource = {}
  // Where to write coverage information
  this.coverageOutDir = this.options["coverage-dir"]
  // Temporary test files bunkerified we'll remove later
  this.f2delete = []
  // Raw coverage stats, as read from JSON files
  this.rawCovStats = []
  // Processed coverage information, per file to cover:
  this.covStats = {}

  if (dir) {
    var filesToCover = this.options.cover

    if (doCoverage) {
      var mkdirp = require("mkdirp")
      this.coverageOutDir = path.resolve(this.coverageOutDir)
      this.getFilesToCover(filesToCover)
      var self = this
      return mkdirp(this.coverageOutDir, 0755, function (er) {
        if (er) return self.emit("error", er)
        self.run(dir, cb)
      })
    }

    this.run(dir, cb)
  }
}


Runner.prototype.run = function() {
  var self = this
    , args = Array.prototype.slice.call(arguments)
    , cb = args.pop() || finish

  function finish (er) {
    if (er) {
      self.emit("error", er)
    }

    if (!doCoverage) return self.end()

    // Cleanup temporary test files with coverage:
    self.f2delete.forEach(function(f) {
      fs.unlinkSync(f)
    })
    self.getFilesToCoverSource(function(err, data) {
      if (err) {
        self.emit("error", err)
      }
      self.getPerFileCovInfo(function(err, data) {
        if (err) {
          self.emit("error", err)
        }
        self.mergeCovStats(function(err, data) {
          if (err) {
            self.emit("error", err)
          }
          CovHtml(self.covStats, self.coverageOutDir, function() {
            self.end()
          })
        })
      })
    })
  }

  if (Array.isArray(args[0])) {
    args = args[0]
  }
  self.runFiles(args, "", cb)
}

Runner.prototype.runDir = function (dir, cb) {
  var self = this
  fs.readdir(dir, function (er, files) {
    if (er) {
      self.write(assert.fail("failed to readdir " + dir, { error: er }))
      self.end()
      return
    }
    files = files.sort(function(a, b) {
      return a > b ? 1 : -1
    })
    files = files.filter(function(f) {
      return !f.match(/^\./)
    })
    files = files.map(path.resolve.bind(path, dir))

    self.runFiles(files, path.resolve(dir), cb)
  })
}


// glob the filenames so that test/*.js works on windows
Runner.prototype.runFiles = function (files, dir, cb) {
  var self = this
  var globRes = []
  chain(files.map(function (f) {
    return function (cb) {
      glob(f, function (er, files) {
        if (er)
          return cb(er)
        globRes.push.apply(globRes, files)
        cb()
      })
    }
  }), function (er) {
    if (er)
      return cb(er)
    runFiles(self, globRes, dir, cb)
  })
}

function runFiles(self, files, dir, cb) {
  chain(files.map(function(f) {
    return function (cb) {
      if (self._bailedOut) return
      var relDir = dir || path.dirname(f)
        , fileName = relDir === "." ? f : f.substr(relDir.length + 1)

      self.write(fileName)
      fs.lstat(f, function(er, st) {
        if (er) {
          self.write(assert.fail("failed to stat " + f, {error: er}))
          return cb()
        }

        var cmd = f, args = [], env = {}

        if (path.extname(f) === ".js") {
          cmd = "node"
          if (self.options.gc) {
            args.push("--expose-gc")
          }
          args.push(fileName)
        } else if (path.extname(f) === ".coffee") {
          cmd = "coffee"
          args.push(fileName)
        } else {
          // Check if file is executable
          if ((st.mode & 0100) && process.getuid) {
            if (process.getuid() != st.uid) {
              return cb()
            }
          } else if ((st.mode & 0010) && process.getgid) {
            if (process.getgid() != st.gid) {
              return cb()
            }
          } else if ((st.mode & 0001) == 0) {
            return cb()
          }
        }

        if (st.isDirectory()) {
          return self.runDir(f, cb)
        }

        if (doCoverage && path.extname(f) === ".js") {
          var foriginal = fs.readFileSync(f, "utf8")
            , fcontents = self.coverHeader() + foriginal + self.coverFooter()
            , tmpBaseName = path.basename(f, path.extname(f))
                          + ".with-coverage." + process.pid + path.extname(f)
            , tmpFname = path.resolve(path.dirname(f), tmpBaseName)

          fs.writeFileSync(tmpFname, fcontents, "utf8")
          args.splice(-1, 1, tmpFname)
        }

        for (var i in process.env) {
          env[i] = process.env[i]
        }
        env.TAP = 1

        var cp = child_process.spawn(cmd, args, { env: env, cwd: relDir })
          , out = ""
          , err = ""
          , tc = new TapConsumer()
          , childTests = [f]

        var timeout = setTimeout(function () {
          if (!cp._ended) {
            cp._timedOut = true
            cp.kill()
          }
        }, self.options.timeout * 1000)

        tc.on("data", function(c) {
          self.emit("result", c)
          self.write(c)
        })

        tc.on("bailout", function (message) {
          clearTimeout(timeout)
          console.log("# " + f.substr(process.cwd().length + 1))
          process.stderr.write(err)
          process.stdout.write(out + "\n")
          self._bailedOut = true
          cp._ended = true
          cp.kill()
        })

        cp.stdout.pipe(tc)
        cp.stdout.on("data", function (c) { out += c })
        cp.stderr.on("data", function (c) {
          if (self.options.stderr) process.stderr.write(c)
          err += c
        })

        cp.on("close", function (code, signal) {
          if (cp._ended) return
          cp._ended = true
          var ok = !cp._timedOut && code === 0
          clearTimeout(timeout)
          //childTests.forEach(function (c) { self.write(c) })
          var res = { name: path.dirname(f).replace(process.cwd() + "/", "")
                          + "/" + fileName
                    , ok: ok
                    , exit: code }

          if (cp._timedOut)
            res.timedOut = cp._timedOut
          if (signal)
            res.signal = signal

          if (err) {
            res.stderr = err
            if (tc.results.ok &&
                tc.results.tests === 0 &&
                !self.options.stderr) {
              // perhaps a compilation error or something else failed.
              // no need if stderr is set, since it will have been
              // output already anyway.
              console.error(err)
            }
          }

          // tc.results.ok = tc.results.ok && ok
          tc.results.add(res)
          res.command = [cmd].concat(args).map(JSON.stringify).join(" ")
          self.emit("result", res)
          self.emit("file", f, res, tc.results)
          self.write(res)
          self.write("\n")
          if (doCoverage) {
            self.f2delete.push(tmpFname)
          }
          cb()
        })
      })
    }
  }), cb)

  return self
}


// Get an array of full paths to files we are interested into obtain
// code coverage.
Runner.prototype.getFilesToCover = function(filesToCover) {
  var self = this
  filesToCover = filesToCover.split(",").map(function(f) {
    return path.resolve(f)
  }).filter(function(f) {
    return path.existsSync(f)
  })

  function recursive(f) {
    if (path.extname(f) === "") {
      // Is a directory:
      fs.readdirSync(f).forEach(function(p) {
        recursive(f + "/" + p)
      })
    } else {
      self.coverageFiles.push(f)
    }
  }
  filesToCover.forEach(function(f) {
    recursive(f)
  })
}

// Prepend to every test file to run. Note tap.test at the very top due it
// "plays" with include paths.
Runner.prototype.coverHeader = function() {
  // semi here since we're injecting it before the first line,
  // and don't want to mess up line numbers in the test files.
  return "var ___TAP_COVERAGE = require("
       + JSON.stringify(require.resolve("runforcover"))
       + ").cover(/.*/g);"
}

// Append at the end of every test file to run. Actually, the stuff which gets
// the coverage information.
// Maybe it would be better to move into a separate file template so editing
// could be easier.
Runner.prototype.coverFooter = function() {
  var self = this
  // This needs to be a string with proper interpolations:
  return [ ""
  , "var ___TAP = require(" + JSON.stringify(require.resolve("./main.js")) + ")"
  , "if (typeof ___TAP._plan === 'number') ___TAP._plan ++"
  , "___TAP.test(" + JSON.stringify("___coverage") + ", function(t) {"
  , "  var covFiles = " + JSON.stringify(self.coverageFiles)
  , "    , covDir = " + JSON.stringify(self.coverageOutDir)
  , "    , path = require('path')"
  , "    , fs = require('fs')"
  , "    , testFnBase = path.basename(__filename, '.js') + '.json'"
  , "    , testFn = path.resolve(covDir, testFnBase)"
  , ""
  , "  function asyncForEach(arr, fn, callback) {"
  , "    if (!arr.length) {"
  , "      return callback()"
  , "    }"
  , "    var completed = 0"
  , "    arr.forEach(function(i) {"
  , "      fn(i, function (err) {"
  , "        if (err) {"
  , "          callback(err)"
  , "          callback = function () {}"
  , "        } else {"
  , "          completed += 1"
  , "          if (completed === arr.length) {"
  , "            callback()"
  , "          }"
  , "        }"
  , "      })"
  , "    })"
  , "  }"
  , ""
  , "  ___TAP_COVERAGE(function(coverageData) {"
  , "    var outObj = {}"
  , "    asyncForEach(covFiles, function(f, cb) {"
  , "      if (coverageData[f]) {"
  , "        var stats = coverageData[f].stats()"
  , "          , stObj = stats"
  , "        stObj.lines = stats.lines.map(function (l) {"
  , "          return { number: l.lineno, source: l.source() }"
  , "        })"
  , "        outObj[f] = stObj"
  , "      }"
  , "      cb()"
  , "    }, function(err) {"
  , "      ___TAP_COVERAGE.release()"
  , "      fs.writeFileSync(testFn, JSON.stringify(outObj))"
  , "      t.end()"
  , "    })"
  , "  })"
  , "})" ].join("\n")
}


Runner.prototype.getFilesToCoverSource = function(cb) {
  var self = this
  asyncMap(self.coverageFiles, function(f, cb) {
    fs.readFile(f, "utf8", function(err, data) {
      var lc = 0
      if (err) {
        cb(err)
      }
      self.coverageFilesSource[f] = data.split("\n").map(function(l) {
        lc += 1
        return { number: lc, source: l }
      })
      cb()
    })
  }, cb)
}

Runner.prototype.getPerFileCovInfo = function(cb) {
  var self = this
    , covPath = path.resolve(self.coverageOutDir)

  fs.readdir(covPath, function(err, files) {
    if (err) {
      self.emit("error", err)
    }
    var covFiles = files.filter(function(f) {
      return path.extname(f) === ".json"
    })
    asyncMap(covFiles, function(f, cb) {
      fs.readFile(path.resolve(covPath, f), "utf8", function(err, data) {
        if (err) {
          cb(err)
        }
        self.rawCovStats.push(JSON.parse(data))
        cb()
      })
    }, function(f, cb) {
      fs.unlink(path.resolve(covPath, f), cb)
    }, cb)
  })
}

Runner.prototype.mergeCovStats = function(cb) {
  var self = this
  self.rawCovStats.forEach(function(st) {
    Object.keys(st).forEach(function(i) {
      // If this is the first time we reach this file, just add the info:
      if (!self.covStats[i]) {
        self.covStats[i] = {
          missing: st[i].lines
        }
      } else {
        // If we already added info for this file before, we need to remove
        // from self.covStats any line not duplicated again (since it has
        // run on such case)
        self.covStats[i].missing = self.covStats[i].missing.filter(
          function(l) {
            return (st[i].lines.indexOf(l))
          })
      }
    })
  })

  // This is due to a bug into
  // chrisdickinson/node-bunker/blob/feature/add-coverage-interface
  // which is using array indexes for line numbers instead of the right number
  Object.keys(self.covStats).forEach(function(f) {
    self.covStats[f].missing = self.covStats[f].missing.map(function(line) {
      return { number: line.number, source: line.source }
    })
  })

  Object.keys(self.coverageFilesSource).forEach(function(f) {
    if (!self.covStats[f]) {
      self.covStats[f] = { missing: self.coverageFilesSource[f]
                          , percentage: 0
      }
    }
    self.covStats[f].lines = self.coverageFilesSource[f]
    self.covStats[f].loc = self.coverageFilesSource[f].length

    if (!self.covStats[f].percentage) {
      self.covStats[f].percentage =
        1 - (self.covStats[f].missing.length / self.covStats[f].loc)
    }

  })
  cb()
}

})(require("__browserify_process"))
},{"fs":28,"child_process":29,"path":30,"slide":31,"./tap-producer.js":4,"./tap-consumer.js":5,"./tap-assert.js":10,"inherits":11,"util":16,"./tap-cov-html.js":32,"glob":33,"mkdirp":34,"__browserify_process":13}],28:[function(require,module,exports){// nothing to see here... no file methods for the browser

},{}],29:[function(require,module,exports){exports.spawn = function () {};
exports.exec = function () {};

},{}],30:[function(require,module,exports){(function(process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

})(require("__browserify_process"))
},{"__browserify_process":13}],31:[function(require,module,exports){exports.asyncMap = require("./async-map")
exports.bindActor = require("./bind-actor")
exports.chain = require("./chain")

},{"./async-map":35,"./bind-actor":36,"./chain":37}],35:[function(require,module,exports){(function(process){
/*
usage:

// do something to a list of things
asyncMap(myListOfStuff, function (thing, cb) { doSomething(thing.foo, cb) }, cb)
// do more than one thing to each item
asyncMap(list, fooFn, barFn, cb)

*/

module.exports = asyncMap

function asyncMap () {
  var steps = Array.prototype.slice.call(arguments)
    , list = steps.shift() || []
    , cb_ = steps.pop()
  if (typeof cb_ !== "function") throw new Error(
    "No callback provided to asyncMap")
  if (!list) return cb_(null, [])
  if (!Array.isArray(list)) list = [list]
  var n = steps.length
    , data = [] // 2d array
    , errState = null
    , l = list.length
    , a = l * n
  if (!a) return cb_(null, [])
  function cb (er) {
    if (errState) return
    var argLen = arguments.length
    for (var i = 1; i < argLen; i ++) if (arguments[i] !== undefined) {
      data[i - 1] = (data[i - 1] || []).concat(arguments[i])
    }
    // see if any new things have been added.
    if (list.length > l) {
      var newList = list.slice(l)
      a += (list.length - l) * n
      l = list.length
      process.nextTick(function () {
        newList.forEach(function (ar) {
          steps.forEach(function (fn) { fn(ar, cb) })
        })
      })
    }

    if (er || --a === 0) {
      errState = er
      cb_.apply(null, [errState].concat(data))
    }
  }
  // expect the supplied cb function to be called
  // "n" times for each thing in the array.
  list.forEach(function (ar) {
    steps.forEach(function (fn) { fn(ar, cb) })
  })
}

})(require("__browserify_process"))
},{"__browserify_process":13}],36:[function(require,module,exports){module.exports = bindActor
function bindActor () {
  var args = 
        Array.prototype.slice.call
        (arguments) // jswtf.
    , obj = null
    , fn
  if (typeof args[0] === "object") {
    obj = args.shift()
    fn = args.shift()
    if (typeof fn === "string")
      fn = obj[ fn ]
  } else fn = args.shift()
  return function (cb) {
    fn.apply(obj, args.concat(cb)) }
}

},{}],37:[function(require,module,exports){module.exports = chain
var bindActor = require("./bind-actor.js")
chain.first = {} ; chain.last = {}
function chain (things, cb) {
  var res = []
  ;(function LOOP (i, len) {
    if (i >= len) return cb(null,res)
    if (Array.isArray(things[i]))
      things[i] = bindActor.apply(null,
        things[i].map(function(i){
          return (i===chain.first) ? res[0]
           : (i===chain.last)
             ? res[res.length - 1] : i }))
    if (!things[i]) return LOOP(i + 1, len)
    things[i](function (er, data) {
      if (er) return cb(er, res)
      if (data !== undefined) res = res.concat(data)
      LOOP(i + 1, len)
    })
  })(0, things.length) }

},{"./bind-actor.js":36}],32:[function(require,module,exports){(function(process){var fs = require('fs'),
    path = require('path'),
    asyncMap = require("slide").asyncMap,
    util = require('util');

var CovHtml = module.exports = function(cov_stats, cov_dir, cb) {
  var index = [];

  asyncMap(
    Object.keys(cov_stats),
    function(f, cb) {
      var st = cov_stats[f],
          missing_lines = st.missing.map(function(l) {
            return l.number;
          }),
          out = '<!doctype html>\n<html lang="en">\n<head>\n  ' +
                '<meta charset="utf-8">\n  <title>' +

      f + ' (' + st.loc + ')</title>\n' +
      '<style type="text/css">\n' + 
      'li {\n' +
      '  font-family: monospace;\n' +
      '  white-space: pre;\n' +
      '}\n' +
      '</style>\n' +
      '</head>\n<body>\n' +
      '<h1>' + f + ' (' + st.loc + ')' + '</h1>' +
      '<h2>Run: ' + (st.missing.length ? st.loc - st.missing.length : st.loc) + ', Missing: ' +
      st.missing.length + ', Percentage: ' + st.percentage + '</h2>' +
      '<h2>Source:</h2>\n' +
      '<ol>\n' + 
      st.lines.map(function(line) {
        var number = line.number,
            color = (missing_lines.indexOf(number) !== -1) ? '#fcc' : '#cfc';
        return '<li id="L' + line.number + '" style="background-color: ' + color +
               ';">' + line.source.replace(/</g, "&lt;") + '</li>';
      }).join('\n') + 
      '</ol>\n' +
      '<h2>Data</h2>\n'+
      '<pre>' + util.inspect(st, true, Infinity, false).replace(/</g, "&lt;") + '</pre></body>\n</html>';

      fs.writeFile(
        cov_dir + '/' + 
        f.replace(process.cwd() + '/', '').replace(/\//g, '+') + '.html',
        out,
        'utf8',
        function(err) {
          if (err) {
            throw err;
          }
          index.push(f);
          cb();
        });
    },
    function(err) {
      if (err) {
        throw err;
      }
      var out = '<!doctype html>\n<html lang="en">\n<head>\n  ' +
          '<meta charset="utf-8">\n  <title>Coverage Index</title>\n</head>\n' +
          '<body>\n<h1>Code Coverage Information</h1>\n<ul>' +
          index.map(function(fname) {
            return '<li><a href="' +
            fname.replace(process.cwd() + '/', '').replace(/\//g, '+') + '.html' +
            '">' + fname + '</a></li>';
          }).join('\n') + '</ul>\n</body>\n</html>';

      fs.writeFile(cov_dir + '/index.html', out, 'utf8', function(err) {
        if (err) {
          throw err;
        }
        cb();
      });   
    }
  );
};



})(require("__browserify_process"))
},{"fs":28,"path":30,"slide":31,"util":16,"__browserify_process":13}],33:[function(require,module,exports){(function(process){// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
// readdir(PREFIX) as ENTRIES
//   If fails, END
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $])
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $])
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.



module.exports = glob

var fs = require("graceful-fs")
, minimatch = require("minimatch")
, Minimatch = minimatch.Minimatch
, inherits = require("inherits")
, EE = require("events").EventEmitter
, path = require("path")
, isDir = {}
, assert = require("assert").ok

function glob (pattern, options, cb) {
  if (typeof options === "function") cb = options, options = {}
  if (!options) options = {}

  if (typeof options === "number") {
    deprecated()
    return
  }

  var g = new Glob(pattern, options, cb)
  return g.sync ? g.found : g
}

glob.fnmatch = deprecated

function deprecated () {
  throw new Error("glob's interface has changed. Please see the docs.")
}

glob.sync = globSync
function globSync (pattern, options) {
  if (typeof options === "number") {
    deprecated()
    return
  }

  options = options || {}
  options.sync = true
  return glob(pattern, options)
}


glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (!(this instanceof Glob)) {
    return new Glob(pattern, options, cb)
  }

  if (typeof cb === "function") {
    this.on("error", cb)
    this.on("end", function (matches) {
      cb(null, matches)
    })
  }

  options = options || {}

  this.EOF = {}
  this._emitQueue = []

  this.maxDepth = options.maxDepth || 1000
  this.maxLength = options.maxLength || Infinity
  this.statCache = options.statCache || {}

  this.changedCwd = false
  var cwd = process.cwd()
  if (!options.hasOwnProperty("cwd")) this.cwd = cwd
  else {
    this.cwd = options.cwd
    this.changedCwd = path.resolve(options.cwd) !== cwd
  }

  this.root = options.root || path.resolve(this.cwd, "/")
  this.root = path.resolve(this.root)
  if (process.platform === "win32")
    this.root = this.root.replace(/\\/g, "/")

  this.nomount = !!options.nomount

  if (!pattern) {
    throw new Error("must provide pattern")
  }

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  this.strict = options.strict !== false
  this.dot = !!options.dot
  this.mark = !!options.mark
  this.sync = !!options.sync
  this.nounique = !!options.nounique
  this.nonull = !!options.nonull
  this.nosort = !!options.nosort
  this.nocase = !!options.nocase
  this.stat = !!options.stat

  this.debug = !!options.debug || !!options.globDebug
  if (this.debug)
    this.log = console.error

  this.silent = !!options.silent

  var mm = this.minimatch = new Minimatch(pattern, options)
  this.options = mm.options
  pattern = this.pattern = mm.pattern

  this.error = null
  this.aborted = false

  EE.call(this)

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  this.minimatch.set.forEach(iterator.bind(this))
  function iterator (pattern, i, set) {
    this._process(pattern, 0, i, function (er) {
      if (er) this.emit("error", er)
      if (-- n <= 0) this._finish()
    })
  }
}

Glob.prototype.log = function () {}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)

  var nou = this.nounique
  , all = nou ? [] : {}

  for (var i = 0, l = this.matches.length; i < l; i ++) {
    var matches = this.matches[i]
    this.log("matches[%d] =", i, matches)
    // do like the shell, and spit out the literal glob
    if (!matches) {
      if (this.nonull) {
        var literal = this.minimatch.globSet[i]
        if (nou) all.push(literal)
        else all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou) all.push.apply(all, m)
      else m.forEach(function (m) {
        all[m] = true
      })
    }
  }

  if (!nou) all = Object.keys(all)

  if (!this.nosort) {
    all = all.sort(this.nocase ? alphasorti : alphasort)
  }

  if (this.mark) {
    // at *some* point we statted all of these
    all = all.map(function (m) {
      var sc = this.statCache[m]
      if (!sc)
        return m
      var isDir = (Array.isArray(sc) || sc === 2)
      if (isDir && m.slice(-1) !== "/") {
        return m + "/"
      }
      if (!isDir && m.slice(-1) === "/") {
        return m.replace(/\/+$/, "")
      }
      return m
    }, this)
  }

  this.log("emitting end", all)

  this.EOF = this.found = all
  this.emitMatch(this.EOF)
}

function alphasorti (a, b) {
  a = a.toLowerCase()
  b = b.toLowerCase()
  return alphasort(a, b)
}

function alphasort (a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit("abort")
}

Glob.prototype.pause = function () {
  if (this.paused) return
  if (this.sync)
    this.emit("error", new Error("Can't pause/resume sync glob"))
  this.paused = true
  this.emit("pause")
}

Glob.prototype.resume = function () {
  if (!this.paused) return
  if (this.sync)
    this.emit("error", new Error("Can't pause/resume sync glob"))
  this.paused = false
  this.emit("resume")
  this._processEmitQueue()
  //process.nextTick(this.emit.bind(this, "resume"))
}

Glob.prototype.emitMatch = function (m) {
  this._emitQueue.push(m)
  this._processEmitQueue()
}

Glob.prototype._processEmitQueue = function (m) {
  while (!this._processingEmitQueue &&
         !this.paused) {
    this._processingEmitQueue = true
    var m = this._emitQueue.shift()
    if (!m) {
      this._processingEmitQueue = false
      break
    }

    this.log('emit!', m === this.EOF ? "end" : "match")

    this.emit(m === this.EOF ? "end" : "match", m)
    this._processingEmitQueue = false
  }
}

Glob.prototype._process = function (pattern, depth, index, cb_) {
  assert(this instanceof Glob)

  var cb = function cb (er, res) {
    assert(this instanceof Glob)
    if (this.paused) {
      if (!this._processQueue) {
        this._processQueue = []
        this.once("resume", function () {
          var q = this._processQueue
          this._processQueue = null
          q.forEach(function (cb) { cb() })
        })
      }
      this._processQueue.push(cb_.bind(this, er, res))
    } else {
      cb_.call(this, er, res)
    }
  }.bind(this)

  if (this.aborted) return cb()

  if (depth > this.maxDepth) return cb()

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === "string") {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      prefix = pattern.join("/")
      this._stat(prefix, function (exists, isDir) {
        // either it's there, or it isn't.
        // nothing more to do, either way.
        if (exists) {
          if (prefix && isAbsolute(prefix) && !this.nomount) {
	    if (prefix.charAt(0) === "/") {
              prefix = path.join(this.root, prefix)
	    } else {
	      prefix = path.resolve(this.root, prefix)
	    }
          }

          if (process.platform === "win32")
            prefix = prefix.replace(/\\/g, "/")

          this.matches[index] = this.matches[index] || {}
          this.matches[index][prefix] = true
          this.emitMatch(prefix)
        }
        return cb()
      })
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's "absolute" like /foo/bar,
      // or "relative" like "../baz"
      prefix = pattern.slice(0, n)
      prefix = prefix.join("/")
      break
  }

  // get the list of entries.
  var read
  if (prefix === null) read = "."
  else if (isAbsolute(prefix) || isAbsolute(pattern.join("/"))) {
    if (!prefix || !isAbsolute(prefix)) {
      prefix = path.join("/", prefix)
    }
    read = prefix = path.resolve(prefix)

    // if (process.platform === "win32")
    //   read = prefix = prefix.replace(/^[a-zA-Z]:|\\/g, "/")

    this.log('absolute: ', prefix, this.root, pattern, read)
  } else {
    read = prefix
  }

  this.log('readdir(%j)', read, this.cwd, this.root)

  return this._readdir(read, function (er, entries) {
    if (er) {
      // not a directory!
      // this means that, whatever else comes after this, it can never match
      return cb()
    }

    // globstar is special
    if (pattern[n] === minimatch.GLOBSTAR) {
      // test without the globstar, and with every child both below
      // and replacing the globstar.
      var s = [ pattern.slice(0, n).concat(pattern.slice(n + 1)) ]
      entries.forEach(function (e) {
        if (e.charAt(0) === "." && !this.dot) return
        // instead of the globstar
        s.push(pattern.slice(0, n).concat(e).concat(pattern.slice(n + 1)))
        // below the globstar
        s.push(pattern.slice(0, n).concat(e).concat(pattern.slice(n)))
      }, this)

      // now asyncForEach over this
      var l = s.length
      , errState = null
      s.forEach(function (gsPattern) {
        this._process(gsPattern, depth + 1, index, function (er) {
          if (errState) return
          if (er) return cb(errState = er)
          if (--l <= 0) return cb()
        })
      }, this)

      return
    }

    // not a globstar
    // It will only match dot entries if it starts with a dot, or if
    // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
    var pn = pattern[n]
    if (typeof pn === "string") {
      var found = entries.indexOf(pn) !== -1
      entries = found ? entries[pn] : []
    } else {
      var rawGlob = pattern[n]._glob
      , dotOk = this.dot || rawGlob.charAt(0) === "."

      entries = entries.filter(function (e) {
        return (e.charAt(0) !== "." || dotOk) &&
               (typeof pattern[n] === "string" && e === pattern[n] ||
                e.match(pattern[n]))
      })
    }

    // If n === pattern.length - 1, then there's no need for the extra stat
    // *unless* the user has specified "mark" or "stat" explicitly.
    // We know that they exist, since the readdir returned them.
    if (n === pattern.length - 1 &&
        !this.mark &&
        !this.stat) {
      entries.forEach(function (e) {
        if (prefix) {
          if (prefix !== "/") e = prefix + "/" + e
          else e = prefix + e
        }
        if (e.charAt(0) === "/" && !this.nomount) {
          e = path.join(this.root, e)
        }

        if (process.platform === "win32")
          e = e.replace(/\\/g, "/")

        this.matches[index] = this.matches[index] || {}
        this.matches[index][e] = true
        this.emitMatch(e)
      }, this)
      return cb.call(this)
    }


    // now test all the remaining entries as stand-ins for that part
    // of the pattern.
    var l = entries.length
    , errState = null
    if (l === 0) return cb() // no matches possible
    entries.forEach(function (e) {
      var p = pattern.slice(0, n).concat(e).concat(pattern.slice(n + 1))
      this._process(p, depth + 1, index, function (er) {
        if (errState) return
        if (er) return cb(errState = er)
        if (--l === 0) return cb.call(this)
      })
    }, this)
  })

}

Glob.prototype._stat = function (f, cb) {
  assert(this instanceof Glob)
  var abs = f
  if (f.charAt(0) === "/") {
    abs = path.join(this.root, f)
  } else if (this.changedCwd) {
    abs = path.resolve(this.cwd, f)
  }
  this.log('stat', [this.cwd, f, '=', abs])
  if (f.length > this.maxLength) {
    var er = new Error("Path name too long")
    er.code = "ENAMETOOLONG"
    er.path = f
    return this._afterStat(f, abs, cb, er)
  }

  if (this.statCache.hasOwnProperty(f)) {
    var exists = this.statCache[f]
    , isDir = exists && (Array.isArray(exists) || exists === 2)
    if (this.sync) return cb.call(this, !!exists, isDir)
    return process.nextTick(cb.bind(this, !!exists, isDir))
  }

  if (this.sync) {
    var er, stat
    try {
      stat = fs.statSync(abs)
    } catch (e) {
      er = e
    }
    this._afterStat(f, abs, cb, er, stat)
  } else {
    fs.stat(abs, this._afterStat.bind(this, f, abs, cb))
  }
}

Glob.prototype._afterStat = function (f, abs, cb, er, stat) {
  var exists
  assert(this instanceof Glob)

  if (abs.slice(-1) === "/" && stat && !stat.isDirectory()) {
    this.log("should be ENOTDIR, fake it")

    er = new Error("ENOTDIR, not a directory '" + abs + "'")
    er.path = abs
    er.code = "ENOTDIR"
    stat = null
  }

  if (er || !stat) {
    exists = false
  } else {
    exists = stat.isDirectory() ? 2 : 1
  }
  this.statCache[f] = this.statCache[f] || exists
  cb.call(this, !!exists, exists === 2)
}

Glob.prototype._readdir = function (f, cb) {
  assert(this instanceof Glob)
  var abs = f
  if (f.charAt(0) === "/") {
    abs = path.join(this.root, f)
  } else if (isAbsolute(f)) {
    abs = f
  } else if (this.changedCwd) {
    abs = path.resolve(this.cwd, f)
  }

  this.log('readdir', [this.cwd, f, abs])
  if (f.length > this.maxLength) {
    var er = new Error("Path name too long")
    er.code = "ENAMETOOLONG"
    er.path = f
    return this._afterReaddir(f, abs, cb, er)
  }

  if (this.statCache.hasOwnProperty(f)) {
    var c = this.statCache[f]
    if (Array.isArray(c)) {
      if (this.sync) return cb.call(this, null, c)
      return process.nextTick(cb.bind(this, null, c))
    }

    if (!c || c === 1) {
      // either ENOENT or ENOTDIR
      var code = c ? "ENOTDIR" : "ENOENT"
      , er = new Error((c ? "Not a directory" : "Not found") + ": " + f)
      er.path = f
      er.code = code
      this.log(f, er)
      if (this.sync) return cb.call(this, er)
      return process.nextTick(cb.bind(this, er))
    }

    // at this point, c === 2, meaning it's a dir, but we haven't
    // had to read it yet, or c === true, meaning it's *something*
    // but we don't have any idea what.  Need to read it, either way.
  }

  if (this.sync) {
    var er, entries
    try {
      entries = fs.readdirSync(abs)
    } catch (e) {
      er = e
    }
    return this._afterReaddir(f, abs, cb, er, entries)
  }

  fs.readdir(abs, this._afterReaddir.bind(this, f, abs, cb))
}

Glob.prototype._afterReaddir = function (f, abs, cb, er, entries) {
  assert(this instanceof Glob)
  if (entries && !er) {
    this.statCache[f] = entries
    // if we haven't asked to stat everything for suresies, then just
    // assume that everything in there exists, so we can avoid
    // having to stat it a second time.  This also gets us one step
    // further into ELOOP territory.
    if (!this.mark && !this.stat) {
      entries.forEach(function (e) {
        if (f === "/") e = f + e
        else e = f + "/" + e
        this.statCache[e] = true
      }, this)
    }

    return cb.call(this, er, entries)
  }

  // now handle errors, and cache the information
  if (er) switch (er.code) {
    case "ENOTDIR": // totally normal. means it *does* exist.
      this.statCache[f] = 1
      return cb.call(this, er)
    case "ENOENT": // not terribly unusual
    case "ELOOP":
    case "ENAMETOOLONG":
    case "UNKNOWN":
      this.statCache[f] = false
      return cb.call(this, er)
    default: // some unusual error.  Treat as failure.
      this.statCache[f] = false
      if (this.strict) this.emit("error", er)
      if (!this.silent) console.error("glob error", er)
      return cb.call(this, er)
  }
}

var isAbsolute = process.platform === "win32" ? absWin : absUnix

function absWin (p) {
  if (absUnix(p)) return true
  // pull off the device/UNC bit from a windows path.
  // from node's lib/path.js
  var splitDeviceRe =
      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/
    , result = splitDeviceRe.exec(p)
    , device = result[1] || ''
    , isUnc = device && device.charAt(1) !== ':'
    , isAbsolute = !!result[2] || isUnc // UNC paths are always absolute

  return isAbsolute
}

function absUnix (p) {
  return p.charAt(0) === "/" || p === ""
}

})(require("__browserify_process"))
},{"graceful-fs":38,"minimatch":39,"inherits":40,"events":14,"path":30,"assert":25,"__browserify_process":13}],38:[function(require,module,exports){(function(process){// this keeps a queue of opened file descriptors, and will make
// fs operations wait until some have closed before trying to open more.

var fs_ = require("fs")

var fs = module.exports = {}

Object.getOwnPropertyNames(fs_).forEach(function(prop) {
  var desc = Object.getOwnPropertyDescriptor(fs_, prop)
  Object.defineProperty(fs, prop, desc)
})

var queue = []
  , constants = require("constants")

exports = module.exports = fs
fs._curOpen = 0

fs.MIN_MAX_OPEN = 64
fs.MAX_OPEN = 1024

var originalOpen = fs.open
  , originalOpenSync = fs.openSync
  , originalClose = fs.close
  , originalCloseSync = fs.closeSync


// prevent EMFILE errors
function OpenReq (path, flags, mode, cb) {
  this.path = path
  this.flags = flags
  this.mode = mode
  this.cb = cb
}

function noop () {}

fs.open = gracefulOpen

function gracefulOpen (path, flags, mode, cb) {
  if (typeof mode === "function") cb = mode, mode = null
  if (typeof cb !== "function") cb = noop

  if (fs._curOpen >= fs.MAX_OPEN) {
    queue.push(new OpenReq(path, flags, mode, cb))
    setTimeout(flush)
    return
  }
  open(path, flags, mode, function (er, fd) {
    if (er && er.code === "EMFILE" && fs._curOpen > fs.MIN_MAX_OPEN) {
      // that was too many.  reduce max, get back in queue.
      // this should only happen once in a great while, and only
      // if the ulimit -n is set lower than 1024.
      fs.MAX_OPEN = fs._curOpen - 1
      return fs.open(path, flags, mode, cb)
    }
    cb(er, fd)
  })
}

function open (path, flags, mode, cb) {
  cb = cb || noop
  fs._curOpen ++
  originalOpen.call(fs, path, flags, mode, function (er, fd) {
    if (er) onclose()
    cb(er, fd)
  })
}

fs.openSync = function (path, flags, mode) {
  var ret
  ret = originalOpenSync.call(fs, path, flags, mode)
  fs._curOpen ++
  return ret
}

function onclose () {
  fs._curOpen --
  flush()
}

function flush () {
  while (fs._curOpen < fs.MAX_OPEN) {
    var req = queue.shift()
    if (!req) return
    open(req.path, req.flags || "r", req.mode || 0777, req.cb)
  }
}

fs.close = function (fd, cb) {
  cb = cb || noop
  originalClose.call(fs, fd, function (er) {
    onclose()
    cb(er)
  })
}

fs.closeSync = function (fd) {
  onclose()
  return originalCloseSync.call(fs, fd)
}


// (re-)implement some things that are known busted or missing.

var constants = require("constants")

// lchmod, broken prior to 0.6.2
// back-port the fix here.
if (constants.hasOwnProperty('O_SYMLINK') &&
    process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
  fs.lchmod = function (path, mode, callback) {
    callback = callback || noop
    fs.open( path
           , constants.O_WRONLY | constants.O_SYMLINK
           , mode
           , function (err, fd) {
      if (err) {
        callback(err)
        return
      }
      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      fs.fchmod(fd, mode, function (err) {
        fs.close(fd, function(err2) {
          callback(err || err2)
        })
      })
    })
  }

  fs.lchmodSync = function (path, mode) {
    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

    // prefer to return the chmod error, if one occurs,
    // but still try to close, and report closing errors if they occur.
    var err, err2
    try {
      var ret = fs.fchmodSync(fd, mode)
    } catch (er) {
      err = er
    }
    try {
      fs.closeSync(fd)
    } catch (er) {
      err2 = er
    }
    if (err || err2) throw (err || err2)
    return ret
  }
}


// lutimes implementation, or no-op
if (!fs.lutimes) {
  if (constants.hasOwnProperty("O_SYMLINK")) {
    fs.lutimes = function (path, at, mt, cb) {
      fs.open(path, constants.O_SYMLINK, function (er, fd) {
        cb = cb || noop
        if (er) return cb(er)
        fs.futimes(fd, at, mt, function (er) {
          fs.close(fd, function (er2) {
            return cb(er || er2)
          })
        })
      })
    }

    fs.lutimesSync = function (path, at, mt) {
      var fd = fs.openSync(path, constants.O_SYMLINK)
        , err
        , err2
        , ret

      try {
        var ret = fs.futimesSync(fd, at, mt)
      } catch (er) {
        err = er
      }
      try {
        fs.closeSync(fd)
      } catch (er) {
        err2 = er
      }
      if (err || err2) throw (err || err2)
      return ret
    }

  } else if (fs.utimensat && constants.hasOwnProperty("AT_SYMLINK_NOFOLLOW")) {
    // maybe utimensat will be bound soonish?
    fs.lutimes = function (path, at, mt, cb) {
      fs.utimensat(path, at, mt, constants.AT_SYMLINK_NOFOLLOW, cb)
    }

    fs.lutimesSync = function (path, at, mt) {
      return fs.utimensatSync(path, at, mt, constants.AT_SYMLINK_NOFOLLOW)
    }

  } else {
    fs.lutimes = function (_a, _b, _c, cb) { process.nextTick(cb) }
    fs.lutimesSync = function () {}
  }
}


// https://github.com/isaacs/node-graceful-fs/issues/4
// Chown should not fail on einval or eperm if non-root.

fs.chown = chownFix(fs.chown)
fs.fchown = chownFix(fs.fchown)
fs.lchown = chownFix(fs.lchown)

fs.chownSync = chownFixSync(fs.chownSync)
fs.fchownSync = chownFixSync(fs.fchownSync)
fs.lchownSync = chownFixSync(fs.lchownSync)

function chownFix (orig) {
  if (!orig) return orig
  return function (target, uid, gid, cb) {
    return orig.call(fs, target, uid, gid, function (er, res) {
      if (chownErOk(er)) er = null
      cb(er, res)
    })
  }
}

function chownFixSync (orig) {
  if (!orig) return orig
  return function (target, uid, gid) {
    try {
      return orig.call(fs, target, uid, gid)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}

function chownErOk (er) {
  // if there's no getuid, or if getuid() is something other than 0,
  // and the error is EINVAL or EPERM, then just ignore it.
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  // When running as root, or if other types of errors are encountered,
  // then it's strict.
  if (!er || (!process.getuid || process.getuid() !== 0)
      && (er.code === "EINVAL" || er.code === "EPERM")) return true
}


// if lchmod/lchown do not exist, then make them no-ops
if (!fs.lchmod) {
  fs.lchmod = function (path, mode, cb) {
    process.nextTick(cb)
  }
  fs.lchmodSync = function () {}
}
if (!fs.lchown) {
  fs.lchown = function (path, uid, gid, cb) {
    process.nextTick(cb)
  }
  fs.lchownSync = function () {}
}



// on Windows, A/V software can lock the directory, causing this
// to fail with an EACCES or EPERM if the directory contains newly
// created files.  Try again on failure, for up to 1 second.
if (process.platform === "win32") {
  var rename_ = fs.rename
  fs.rename = function rename (from, to, cb) {
    var start = Date.now()
    rename_(from, to, function CB (er) {
      if (er
          && (er.code === "EACCES" || er.code === "EPERM")
          && Date.now() - start < 1000) {
        return rename_(from, to, CB)
      }
      cb(er)
    })
  }
}


// if read() returns EAGAIN, then just try it again.
var read = fs.read
fs.read = function (fd, buffer, offset, length, position, callback_) {
  var callback
  if (callback_ && typeof callback_ === 'function') {
    var eagCounter = 0
    callback = function (er, _, __) {
      if (er && er.code === 'EAGAIN' && eagCounter < 10) {
        eagCounter ++
        return read.call(fs, fd, buffer, offset, length, position, callback)
      }
      callback_.apply(this, arguments)
    }
  }
  return read.call(fs, fd, buffer, offset, length, position, callback)
}

var readSync = fs.readSync
fs.readSync = function (fd, buffer, offset, length, position) {
  var eagCounter = 0
  while (true) {
    try {
      return readSync.call(fs, fd, buffer, offset, length, position)
    } catch (er) {
      if (er.code === 'EAGAIN' && eagCounter < 10) {
        eagCounter ++
        continue
      }
      throw er
    }
  }
}

})(require("__browserify_process"))
},{"fs":28,"constants":41,"__browserify_process":13}],41:[function(require,module,exports){undefined
},{}],39:[function(require,module,exports){(function(process){;(function (require, exports, module, platform) {

if (module) module.exports = minimatch
else exports.minimatch = minimatch

if (!require) {
  require = function (id) {
    switch (id) {
      case "sigmund": return function sigmund (obj) {
        return JSON.stringify(obj)
      }
      case "path": return { basename: function (f) {
        f = f.split(/[\/\\]/)
        var e = f.pop()
        if (!e) e = f.pop()
        return e
      }}
      case "lru-cache": return function LRUCache () {
        // not quite an LRU, but still space-limited.
        var cache = {}
        var cnt = 0
        this.set = function (k, v) {
          cnt ++
          if (cnt >= 100) cache = {}
          cache[k] = v
        }
        this.get = function (k) { return cache[k] }
      }
    }
  }
}

minimatch.Minimatch = Minimatch

var LRU = require("lru-cache")
  , cache = minimatch.cache = new LRU({max: 100})
  , GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
  , sigmund = require("sigmund")

var path = require("path")
  // any single thing other than /
  // don't need to escape / when using new RegExp()
  , qmark = "[^/]"

  // * => any number of characters
  , star = qmark + "*?"

  // ** when dots are allowed.  Anything goes, except .. and .
  // not (^ or / followed by one or two dots followed by $ or /),
  // followed by anything, any number of times.
  , twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?"

  // not a ^ or / followed by a dot,
  // followed by anything, any number of times.
  , twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?"

  // characters that need to be escaped in RegExp.
  , reSpecials = charSet("().*{}+?[]^$\\!")

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split("").reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.monkeyPatch = monkeyPatch
function monkeyPatch () {
  var desc = Object.getOwnPropertyDescriptor(String.prototype, "match")
  var orig = desc.value
  desc.value = function (p) {
    if (p instanceof Minimatch) return p.match(this)
    return orig.call(this, p)
  }
  Object.defineProperty(String.prototype, desc)
}

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}


function minimatch (p, pattern, options) {
  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === "") return p === ""

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options, cache)
  }

  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    pattern = pattern.split("\\").join("/")
  }

  // lru storage.
  // these things aren't particularly big, but walking down the string
  // and turning it into a regexp can get pretty costly.
  var cacheKey = pattern + "\n" + sigmund(options)
  var cached = minimatch.cache.get(cacheKey)
  if (cached) return cached
  minimatch.cache.set(cacheKey, this)

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) console.error(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  if (options.debug) console.error(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  if (options.debug) console.error(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return -1 === s.indexOf(false)
  })

  if (options.debug) console.error(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
    , negate = false
    , options = this.options
    , negateOffset = 0

  if (options.nonegate) return

  for ( var i = 0, l = pattern.length
      ; i < l && pattern.charAt(i) === "!"
      ; i ++) {
    negate = !negate
    negateOffset ++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return new Minimatch(pattern, options).braceExpand()
}

Minimatch.prototype.braceExpand = braceExpand
function braceExpand (pattern, options) {
  options = options || this.options
  pattern = typeof pattern === "undefined"
    ? this.pattern : pattern

  if (typeof pattern === "undefined") {
    throw new Error("undefined pattern")
  }

  if (options.nobrace ||
      !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  var escaping = false

  // examples and comments refer to this crazy pattern:
  // a{b,c{d,e},{f,g}h}x{y,z}
  // expected:
  // abxy
  // abxz
  // acdxy
  // acdxz
  // acexy
  // acexz
  // afhxy
  // afhxz
  // aghxy
  // aghxz

  // everything before the first \{ is just a prefix.
  // So, we pluck that off, and work with the rest,
  // and then prepend it to everything we find.
  if (pattern.charAt(0) !== "{") {
    // console.error(pattern)
    var prefix = null
    for (var i = 0, l = pattern.length; i < l; i ++) {
      var c = pattern.charAt(i)
      // console.error(i, c)
      if (c === "\\") {
        escaping = !escaping
      } else if (c === "{" && !escaping) {
        prefix = pattern.substr(0, i)
        break
      }
    }

    // actually no sets, all { were escaped.
    if (prefix === null) {
      // console.error("no sets")
      return [pattern]
    }

    var tail = braceExpand(pattern.substr(i), options)
    return tail.map(function (t) {
      return prefix + t
    })
  }

  // now we have something like:
  // {b,c{d,e},{f,g}h}x{y,z}
  // walk through the set, expanding each part, until
  // the set ends.  then, we'll expand the suffix.
  // If the set only has a single member, then'll put the {} back

  // first, handle numeric sets, since they're easier
  var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/)
  if (numset) {
    // console.error("numset", numset[1], numset[2])
    var suf = braceExpand(pattern.substr(numset[0].length), options)
      , start = +numset[1]
      , end = +numset[2]
      , inc = start > end ? -1 : 1
      , set = []
    for (var i = start; i != (end + inc); i += inc) {
      // append all the suffixes
      for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
        set.push(i + suf[ii])
      }
    }
    return set
  }

  // ok, walk through the set
  // We hope, somewhat optimistically, that there
  // will be a } at the end.
  // If the closing brace isn't found, then the pattern is
  // interpreted as braceExpand("\\" + pattern) so that
  // the leading \{ will be interpreted literally.
  var i = 1 // skip the \{
    , depth = 1
    , set = []
    , member = ""
    , sawEnd = false
    , escaping = false

  function addMember () {
    set.push(member)
    member = ""
  }

  // console.error("Entering for")
  FOR: for (i = 1, l = pattern.length; i < l; i ++) {
    var c = pattern.charAt(i)
    // console.error("", i, c)

    if (escaping) {
      escaping = false
      member += "\\" + c
    } else {
      switch (c) {
        case "\\":
          escaping = true
          continue

        case "{":
          depth ++
          member += "{"
          continue

        case "}":
          depth --
          // if this closes the actual set, then we're done
          if (depth === 0) {
            addMember()
            // pluck off the close-brace
            i ++
            break FOR
          } else {
            member += c
            continue
          }

        case ",":
          if (depth === 1) {
            addMember()
          } else {
            member += c
          }
          continue

        default:
          member += c
          continue
      } // switch
    } // else
  } // for

  // now we've either finished the set, and the suffix is
  // pattern.substr(i), or we have *not* closed the set,
  // and need to escape the leading brace
  if (depth !== 0) {
    // console.error("didn't close", pattern)
    return braceExpand("\\" + pattern, options)
  }

  // x{y,z} -> ["xy", "xz"]
  // console.error("set", set)
  // console.error("suffix", pattern.substr(i))
  var suf = braceExpand(pattern.substr(i), options)
  // ["b", "c{d,e}","{f,g}h"] ->
  //   [["b"], ["cd", "ce"], ["fh", "gh"]]
  var addBraces = set.length === 1
  // console.error("set pre-expanded", set)
  set = set.map(function (p) {
    return braceExpand(p, options)
  })
  // console.error("set expanded", set)


  // [["b"], ["cd", "ce"], ["fh", "gh"]] ->
  //   ["b", "cd", "ce", "fh", "gh"]
  set = set.reduce(function (l, r) {
    return l.concat(r)
  })

  if (addBraces) {
    set = set.map(function (s) {
      return "{" + s + "}"
    })
  }

  // now attach the suffixes.
  var ret = []
  for (var i = 0, l = set.length; i < l; i ++) {
    for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
      ret.push(set[i] + suf[ii])
    }
  }
  return ret
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === "**") return GLOBSTAR
  if (pattern === "") return ""

  var re = ""
    , hasMagic = false
    , escaping = false
    // ? => one single character
    , patternListStack = []
    , plType
    , stateChar
    , inClass = false
    , reClassStart = -1
    , classStart = -1
    // . and .. never match anything that doesn't start with .,
    // even when options.dot is set.
    , patternStart = pattern.charAt(0) === "." ? "" // anything
      // not (start or / followed by . or .. followed by / or end)
      : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))"
      : "(?!\\.)"

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case "*":
          re += star
          hasMagic = true
          break
        case "?":
          re += qmark
          hasMagic = true
          break
        default:
          re += "\\"+stateChar
          break
      }
      stateChar = false
    }
  }

  for ( var i = 0, len = pattern.length, c
      ; (i < len) && (c = pattern.charAt(i))
      ; i ++ ) {

    if (options.debug) {
      console.error("%s\t%s %s %j", pattern, i, re, c)
    }

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += "\\" + c
      escaping = false
      continue
    }

    SWITCH: switch (c) {
      case "/":
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case "\\":
        clearStateChar()
        escaping = true
        continue

      // the various stateChar values
      // for the "extglob" stuff.
      case "?":
      case "*":
      case "+":
      case "@":
      case "!":
        if (options.debug) {
          console.error("%s\t%s %s %j <-- stateChar", pattern, i, re, c)
        }

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          if (c === "!" && i === classStart + 1) c = "^"
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
        continue

      case "(":
        if (inClass) {
          re += "("
          continue
        }

        if (!stateChar) {
          re += "\\("
          continue
        }

        plType = stateChar
        patternListStack.push({ type: plType
                              , start: i - 1
                              , reStart: re.length })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === "!" ? "(?:(?!" : "(?:"
        stateChar = false
        continue

      case ")":
        if (inClass || !patternListStack.length) {
          re += "\\)"
          continue
        }

        hasMagic = true
        re += ")"
        plType = patternListStack.pop().type
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        switch (plType) {
          case "!":
            re += "[^/]*?)"
            break
          case "?":
          case "+":
          case "*": re += plType
          case "@": break // the default anyway
        }
        continue

      case "|":
        if (inClass || !patternListStack.length || escaping) {
          re += "\\|"
          escaping = false
          continue
        }

        re += "|"
        continue

      // these are mostly the same in regexp and glob
      case "[":
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += "\\" + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
        continue

      case "]":
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += "\\" + c
          escaping = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
        continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
                   && !(c === "^" && inClass)) {
          re += "\\"
        }

        re += c

    } // switch
  } // for


  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    var cs = pattern.substr(classStart + 1)
      , sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + "\\[" + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  var pl
  while (pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + 3)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = "\\"
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + "|"
    })

    // console.error("tail=%j\n   %s", tail, tail)
    var t = pl.type === "*" ? star
          : pl.type === "?" ? qmark
          : "\\" + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart)
       + t + "\\("
       + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += "\\\\"
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case ".":
    case "[":
    case "(": addPatternStart = true
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== "" && hasMagic) re = "(?=.)" + re

  if (addPatternStart) re = patternStart + re

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [ re, hasMagic ]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? "i" : ""
    , regExp = new RegExp("^" + re + "$", flags)

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) return this.regexp = false
  var options = this.options

  var twoStar = options.noglobstar ? star
      : options.dot ? twoStarDot
      : twoStarNoDot
    , flags = options.nocase ? "i" : ""

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
           : (typeof p === "string") ? regExpEscape(p)
           : p._src
    }).join("\\\/")
  }).join("|")

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = "^" + re + "$"

  // can match anything, as long as it's not this.
  if (this.negate) re = "^(?!" + re + ").*$"

  try {
    return this.regexp = new RegExp(re, flags)
  } catch (ex) {
    return this.regexp = false
  }
}

minimatch.match = function (list, pattern, options) {
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  // console.error("match", f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ""

  if (f === "/" && partial) return true

  var options = this.options

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    f = f.split("\\").join("/")
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  if (options.debug) {
    console.error(this.pattern, "split", f)
  }

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  // console.error(this.pattern, "set", set)

  for (var i = 0, l = set.length; i < l; i ++) {
    var pattern = set[i]
    var hit = this.matchOne(f, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  if (options.debug) {
    console.error("matchOne",
                  { "this": this
                  , file: file
                  , pattern: pattern })
  }

  if (options.matchBase && pattern.length === 1) {
    file = path.basename(file.join("/")).split("/")
  }

  if (options.debug) {
    console.error("matchOne", file.length, pattern.length)
  }

  for ( var fi = 0
          , pi = 0
          , fl = file.length
          , pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi ++, pi ++ ) {

    if (options.debug) {
      console.error("matchOne loop")
    }
    var p = pattern[pi]
      , f = file[fi]

    if (options.debug) {
      console.error(pattern, p, f)
    }

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      if (options.debug)
        console.error('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
        , pr = pi + 1
      if (pr === pl) {
        if (options.debug)
          console.error('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for ( ; fi < fl; fi ++) {
          if (file[fi] === "." || file[fi] === ".." ||
              (!options.dot && file[fi].charAt(0) === ".")) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      WHILE: while (fr < fl) {
        var swallowee = file[fr]

        if (options.debug) {
          console.error('\nglobstar while',
                        file, fr, pattern, pr, swallowee)
        }

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          if (options.debug)
            console.error('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === "." || swallowee === ".." ||
              (!options.dot && swallowee.charAt(0) === ".")) {
            if (options.debug)
              console.error("dot detected!", file, fr, pattern, pr)
            break WHILE
          }

          // ** swallows a segment, and continue.
          if (options.debug)
            console.error('globstar swallow a segment, and continue')
          fr ++
        }
      }
      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then 
      if (partial) {
        // ran out of file
        // console.error("\n>>> no match, partial?", file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === "string") {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      if (options.debug) {
        console.error("string match", p, f, hit)
      }
    } else {
      hit = f.match(p)
      if (options.debug) {
        console.error("pattern match", p, f, hit)
      }
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === "")
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error("wtf?")
}


// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, "$1")
}


function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

})( typeof require === "function" ? require : null,
    this,
    typeof module === "object" ? module : null,
    typeof process === "object" ? process.platform : "win32"
  )

})(require("__browserify_process"))
},{"lru-cache":42,"sigmund":43,"path":30,"__browserify_process":13}],42:[function(require,module,exports){(function(){;(function () { // closure for web browsers

if (typeof module === 'object' && module.exports) {
  module.exports = LRUCache
} else {
  // just set the global for non-node platforms.
  this.LRUCache = LRUCache
}

function hOP (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function naiveLength () { return 1 }

function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options)
  }

  var max
  if (typeof options === 'number') {
    max = options
    options = { max: max }
  }
  max = options.max

  if (!options) options = {}

  var lengthCalculator = options.length || naiveLength

  if (typeof lengthCalculator !== "function") {
    lengthCalculator = naiveLength
  }
  if (!max || !(typeof max === "number") || max <= 0 ) {
    // a little bit silly.  maybe this should throw?
    max = Infinity
  }

  var maxAge = options.maxAge || null

  var dispose = options.dispose

  var cache = Object.create(null) // hash of items by key
    , lruList = Object.create(null) // list of items in order of use recency
    , mru = 0 // most recently used
    , length = 0 // number of items in the list
    , itemCount = 0


  // resize the cache when the max changes.
  Object.defineProperty(this, "max",
    { set : function (mL) {
        if (!mL || !(typeof mL === "number") || mL <= 0 ) mL = Infinity
        max = mL
        // if it gets above double max, trim right away.
        // otherwise, do it whenever it's convenient.
        if (length > max) trim()
      }
    , get : function () { return max }
    , enumerable : true
    })

  // resize the cache when the lengthCalculator changes.
  Object.defineProperty(this, "lengthCalculator",
    { set : function (lC) {
        if (typeof lC !== "function") {
          lengthCalculator = naiveLength
          length = itemCount
          for (var key in cache) {
            cache[key].length = 1
          }
        } else {
          lengthCalculator = lC
          length = 0
          for (var key in cache) {
            cache[key].length = lengthCalculator(cache[key].value)
            length += cache[key].length
          }
        }

        if (length > max) trim()
      }
    , get : function () { return lengthCalculator }
    , enumerable : true
    })

  Object.defineProperty(this, "length",
    { get : function () { return length }
    , enumerable : true
    })


  Object.defineProperty(this, "itemCount",
    { get : function () { return itemCount }
    , enumerable : true
    })

  this.reset = function () {
    if (dispose) {
      for (var k in cache) {
        dispose(k, cache[k].value)
      }
    }
    cache = {}
    lruList = {}
    mru = 0
    length = 0
    itemCount = 0
  }

  // Provided for debugging/dev purposes only. No promises whatsoever that
  // this API stays stable.
  this.dump = function () {
    return cache
  }

  this.set = function (key, value) {
    if (hOP(cache, key)) {
      // dispose of the old one before overwriting
      if (dispose) dispose(key, cache[key].value)
      if (maxAge) cache[key].now = Date.now()
      cache[key].value = value
      this.get(key)
      return true
    }

    var len = lengthCalculator(value)
    var age = maxAge ? Date.now() : 0
    var hit = new Entry(key, value, mru++, len, age)

    // oversized objects fall out of cache automatically.
    if (hit.length > max) {
      if (dispose) dispose(key, value)
      return false
    }

    length += hit.length
    lruList[hit.lu] = cache[key] = hit
    itemCount ++

    if (length > max) trim()
    return true
  }

  this.get = function (key) {
    if (!hOP(cache, key)) return
    var hit = cache[key]
    if (maxAge && (Date.now() - hit.now > maxAge)) {
      this.del(key)
      return
    }
    delete lruList[hit.lu]
    hit.lu = mru ++
    lruList[hit.lu] = hit
    return hit.value
  }

  this.del = function (key) {
    if (!hOP(cache, key)) return
    var hit = cache[key]
    if (dispose) dispose(key, hit.value)
    delete cache[key]
    delete lruList[hit.lu]
    length -= hit.length
    itemCount --
  }

  function trim () {
    if (length <= max) return
    for (var k in lruList) {
      if (length <= max) break;
      var hit = lruList[k]
      if (dispose) dispose(hit.key, hit.value)
      length -= hit.length
      delete cache[ hit.key ]
      delete lruList[k]
    }
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, mru, len, age) {
  this.key = key
  this.value = value
  this.lu = mru
  this.length = len
  this.now = age
}

})()

})()
},{}],43:[function(require,module,exports){module.exports = sigmund
function sigmund (subject, maxSessions) {
    maxSessions = maxSessions || 10;
    var notes = [];
    var analysis = '';
    var RE = RegExp;

    function psychoAnalyze (subject, session) {
        if (session > maxSessions) return;

        if (typeof subject === 'function' ||
            typeof subject === 'undefined') {
            return;
        }

        if (typeof subject !== 'object' || !subject ||
            (subject instanceof RE)) {
            analysis += subject;
            return;
        }

        if (notes.indexOf(subject) !== -1 || session === maxSessions) return;

        notes.push(subject);
        analysis += '{';
        Object.keys(subject).forEach(function (issue, _, __) {
            // pseudo-private values.  skip those.
            if (issue.charAt(0) === '_') return;
            var to = typeof subject[issue];
            if (to === 'function' || to === 'undefined') return;
            analysis += issue;
            psychoAnalyze(subject[issue], session + 1);
        });
    }
    psychoAnalyze(subject, 0);
    return analysis;
}

// vim: set softtabstop=4 shiftwidth=4:

},{}],40:[function(require,module,exports){module.exports = inherits

function inherits (c, p, proto) {
  proto = proto || {}
  var e = {}
  ;[c.prototype, proto].forEach(function (s) {
    Object.getOwnPropertyNames(s).forEach(function (k) {
      e[k] = Object.getOwnPropertyDescriptor(s, k)
    })
  })
  c.prototype = Object.create(p.prototype, e)
  c.super = p
}

//function Child () {
//  Child.super.call(this)
//  console.error([this
//                ,this.constructor
//                ,this.constructor === Child
//                ,this.constructor.super === Parent
//                ,Object.getPrototypeOf(this) === Child.prototype
//                ,Object.getPrototypeOf(Object.getPrototypeOf(this))
//                 === Parent.prototype
//                ,this instanceof Child
//                ,this instanceof Parent])
//}
//function Parent () {}
//inherits(Child, Parent)
//new Child

},{}],34:[function(require,module,exports){(function(process){var path = require('path');
var fs = require('fs');

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, mode, f, made) {
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

})(require("__browserify_process"))
},{"path":30,"fs":28,"__browserify_process":13}],2:[function(require,module,exports){//copyright Ryan Day 2010 <http://ryanday.org>, Joscha Feth 2013 <http://www.feth.com> [MIT Licensed]



var process_to_xml = function(node_data,options){

  var makeNode = function(name, content, attributes, level, hasSubNodes) {

    var indent = options.prettyPrint ? '\n' + new Array(level).join("\t") : '';

    var node = [indent, '<',name, (attributes || '')];
    if(content && content.length > 0) {
      node.push('>')
      node.push(content);
      hasSubNodes && node.push(indent);
      node.push('</');
      node.push(name);
      node.push('>');
    } else {
      node.push('/>');
    }
    return node.join('');
  };

  return (function fn(node_data,node_descriptor, level){
    var type = typeof node_data;
    if(node_data instanceof Array) {
      type = 'array';
    } else if(node_data instanceof Date) {
      type = 'date';
    }

    switch(type) {
    //if value is an array create child nodes from values
      case 'array':
        var ret = [];
        node_data.map(function(v){
            ret.push(fn(v,1, level+1));
            //entries that are values of an array are the only ones that can be special node descriptors
        });
        options.prettyPrint && ret.push('\n');
        return ret.join('');
        break;

      case 'date':
        // cast dates to ISO 8601 date (soap likes it)
        return node_data.toJSON?node_data.toJSON():node_data+'';
        break;

      case 'object':
        if(node_descriptor == 1 && node_data.name){
          var content = []
          , attributes = []
          ;

          if(node_data.attrs) {
            if(typeof node_data.attrs != 'object') {
            // attrs is a string, etc. - just use it as an attribute
              attributes.push(' ');
              attributes.push(node_data.attrs);
            } else {
              for(var key in node_data.attrs){
                var value = node_data.attrs[key];
                attributes.push(' ');
                attributes.push(key);
                attributes.push('="')
                attributes.push(options.escape ? esc(value) : value);
                attributes.push('"');
              }
            }
          }

          //later attributes can be added here
          if(typeof node_data.value != 'undefined') {
            var c = ''+node_data.value;
            content.push(options.escape ? esc(c) : c);
          } else if(typeof node_data.text != 'undefined') {
            var c = ''+node_data.text;
            content.push(options.escape ? esc(c) : c);
          }

          if(node_data.children){
            content.push(fn(node_data.children,0,level+1));
          }

          return makeNode(node_data.name, content.join(''), attributes.join(''),level,!!node_data.children);

        } else {
          var nodes = [];
          for(var name in node_data){
            nodes.push(makeNode(name, fn(node_data[name],0,level+1),null,level+1));
          }
          options.prettyPrint && nodes.length > 0 && nodes.push('\n');
          return nodes.join('');
        }
        break;

      case 'function':
        return node_data();
        break;

      default:
        return options.escape ? esc(node_data) : ''+node_data;
    }

  }(node_data, 0, 0))
};


var xml_header = function(standalone) {
  var ret = ['<?xml version="1.0" encoding="utf-8"'];

  if(standalone) {
    ret.push(' standalone="yes"');
  }

  ret.push('?>');

  return ret.join('');
};

module.exports = function(obj,options){

  if(typeof obj == 'string' || isBuffer(obj)) {
    try{
      obj = JSON.parse(obj.toString());
    } catch(e){
      return false;
    }
  }

  var xmlheader = '';
  var docType = '';
  if(options) {
    if(typeof options == 'object') {
      // our config is an object

      if(options.xmlHeader) {
        // the user wants an xml header
        xmlheader = xml_header(!!options.xmlHeader.standalone);
      }

      if(typeof options.docType != 'undefined') {
        docType = '<!DOCTYPE '+options.docType+'>'
      }
    } else {
      // our config is a boolean value, so just add xml header
      xmlheader = xml_header();
    }
  }
  options = options || {}

  var ret = [
    xmlheader,
    (options.prettyPrint && docType ? '\n' : ''),
  docType,
    process_to_xml(obj,options)
  ];

  return ret.join('');
}

module.exports.json_to_xml=
module.exports.obj_to_xml = module.exports;

module.exports.escape = esc;

function esc(str){
  return (''+str).replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}

module.exports.cdata = cdata;

function cdata(str){
  return "<!CDATA[["+str.replace(/]]>/g,'')+']]>';
};

function isBuffer(b){
 try{
   return (b instanceof Buffer);
 } catch(e) {
   return false;
 }
}


},{}]},{},[0]);