Serialize ImmutableJS data
==============================

### Installation

```
npm install --save remotedev-serialize
```

### Usage with ImmutableJS data structures

Just pass the Immutable library to our class:

```js
import Immutable from 'immutable';
import Serialize from 'remotedev-serialize';
const { stringify, parse } =  Serialize.immutable(Immutable);

const data = Immutable.fromJS({foo: 'bar', baz: {qux: 42}});
const serialized = stringify(data);
console.log(serialized);
// {"data":{"foo":"bar","baz":{"data":{"qux":42},"__serializedType__":"ImmutableMap"}},"__serializedType__":"ImmutableMap"}
const parsed = parse(serialized);
console.log(Immutable.is(parsed, data));
// true
```

See [the tests](https://github.com/zalmoxisus/remotedev-serialize/blob/master/test/immutable.spec.js) for more examples of usage.

### Usage with ImmutableJS Record classes

To parse a Record class back, you need to specify a reference to it:

```js
import Immutable from 'immutable';
import Serialize from 'remotedev-serialize';

const ABRecord = Immutable.Record({ a:1, b:2 });
const { stringify, parse } =  Serialize.immutable(Immutable, [ABRecord]);

const myRecord = new ABRecord({ b:3 });
const serialized = stringify(myRecord);
console.log(serialized);
// {"data":{"a":1,"b":3},"__serializedType__":"ImmutableRecord","__serializedRef__":0}
const parsed = parse(serialized);
console.log(Immutable.is(parsed, myRecord));
// true
```

### Supported

#### ImutableJS

- [x] Record
- [x] Range
- [x] Repeat
- [x] Map
- [x] OrderedMap
- [x] List
- [x] Set
- [x] OrderedSet
- [x] Seq
- [x] Stack


#### ES6

- [x] Symbol
- [ ] Map
- [ ] Set
- [ ] Typed Array

### License

MIT
