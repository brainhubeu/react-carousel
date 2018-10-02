# linked-list [![Build Status](https://img.shields.io/travis/wooorm/linked-list.svg?style=flat)](https://travis-ci.org/wooorm/linked-list) [![Coverage Status](https://img.shields.io/coveralls/wooorm/linked-list.svg?style=flat)](https://coveralls.io/r/wooorm/linked-list?branch=master)

Minimalistic [linked](http://blog.millermedeiros.com/linked-lists) [lists](http://wikipedia.org/wiki/Linked_list).

## Installation

npm:
```sh
$ npm install linked-list
```

Component:
```sh
$ component install wooorm/linked-list
```

Bower:
```sh
$ bower install linked-list
```

Standalone library:

```html
<script src="/your/js/path/linked-list.globals.js"></script>
```

Download the latest minified standalone [release](https://raw.github.com/wooorm/linked-list/master/_destination/linked-list.globals.js) and add it to your project.
Include the above snippet in your HTML. This makes the `LinkedList` module available in the global namespace (`window` in the browser).

## Usage

### “Simple”

```js
var LinkedList = require('linked-list'); // or use AMD, or globals.

var item = new LinkedList.Item();
var item_ = new LinkedList.Item();
var item__ = new LinkedList.Item();
var list = new LinkedList(item, item_, item__);

list.head // => item
list.head.next // => item_
list.head.next.next // => item__
list.head.next.prev // => item
list.tail // => item__
list.tail.next // => `null`
```

### Subclassing

```js
var extend = require('some-extending-method...'); // e.g. assimilate.
var List = require('linked-list');
var Item = List.Item;

function Tokens() {
    List.apply(this, arguments);
};

function Token(value) {
    this.value = value;
};

extend(Tokens.prototype, List.prototype, {
    'join' : function(delimeter){
        return this.toArray().join(delimeter);
    }
});

extend(Token.prototype, Item.prototype, {
    'toString' : function(){
        return this.value;
    }
});

var dogs = new Token('dogs');
var and = new Token('&');
var cats = new Token('cats');
var tokens = new Tokens(dogs, and, cats);

tokens.join(' '); // "dogs & cats"

and.prepend(cats);
and.append(dogs);

tokens.join(' ') + '!'; // "cats & dogs!"
```

## API

### LinkedList([items…])
```js
var list = new LinkedList();
```

Creates a new Linked List.


#### LinkedList.from([items[…]])
```js
var list = LinkedList.from(),
    list_ = LinkedList.from([]),
    list__ = LinkedList.from([new LinkedList.Item()]);
```

Creates a new Linked List* from the given array of items. Ignores `null` or `undefined` values. Throws an error when a given item has no `detach`, `append`, or `prepend` methods.

* Actually, a new instance of this, e.g. when placed on `Token` (`Token.from`), it would create a new instance of Token.

#### LinkedList.of([items…])
```js
var list = LinkedList.of(),
    list_ = LinkedList.of(new LinkedList.Item());
```

Creates a new Linked List from the given arguments. Defers to `LinkedList.from` (see above). As in:

```js
List.of = function (/*items...*/) {
    return List.from.call(this, arguments);
};
```

#### LinkedList#append(item)
```js
var list = new LinkedList(),
    item = new LinkedList.Item();

list.head === null // true
item.list === null // true

list.append(item);

list.head === item // true
item.list === list // true
```

Appends an item to a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns the given item.


#### LinkedList#prepend(item)
```js
var list = new LinkedList(),
    item = new LinkedList.Item();

list.prepend(item);
```

Prepends an item to a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns the given item.


#### LinkedList#toArray()
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item(),
    list = new LinkedList(item, item_),
    array = list.toArray();

array[0] === item // true
array[1] === item_ // true
array[0].next === item_ // true
array[1].prev === item // true
```

Returns the items in the list in an array.


#### LinkedList#head
```js
var item = new LinkedList.Item(),
    list = new LinkedList(item);

list.head === item; // true
```

The first item in a list, and `null` otherwise.


#### LinkedList#tail
```js
var list = new LinkedList(),
    item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

list.tail === null; // true

list.append(item);
list.tail === null; // true, see note.

list.append(item_);
list.tail === item_; // true
```

The last item in a list, and `null` otherwise. Note that a list with only one item has **no tail**, only a head.


## LinkedList.Item()
```js
var item = new LinkedList.Item();
```

Creates a new Linked List Item.


#### LinkedList.Item#append(item)
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

(new LinkedList()).append(item);

item.next === null // true

item.append(item_);
item.next === item_ // true
```

Adds the given item **after** the operated on item in a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns false when the operated on item is not attached to a list, otherwise the given item.


#### LinkedList.Item#prepend(item)
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

(new LinkedList()).append(item);

item.prev === null // true

item.prepend(item_);
item.prev === item_ // true
```

Adds the given item **before** the operated on item in a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns false when the operated on item is not attached to a list, otherwise the given item.


#### LinkedList.Item#detach()
```js
var item = new LinkedList.Item(),
    list = new LinkedList(item);

item.list === list // true

item.detach();
item.list === null // true
```

Removes the operated on item from its parent list. Removes references to it on its parent `list`, and `prev` and `next` items; relinking them when possible.
Returns the operated on item. Even when it was already detached.


#### LinkedList.Item#next
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

new LinkedList(item);

item.next === null // true
item_.next === null // true

item.append(item_);

item.next === item_ // true

item.detach();

item.next === null // true
```

The items succeeding item, and `null` otherwise.


#### LinkedList.Item#prev
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

new LinkedList(item);

item.prev === null // true
item_.prev === null // true

item.append(item_);

item_.prev === item // true

item_.detach();

item_.prev === null // true
```

The items preceding item, and `null` otherwise.


#### LinkedList.Item#list
```js
var item = new LinkedList.Item(),
    list = new LinkedList();

item.list === null // true

list.append(item);

item.list === list // true

item.detach();

item.list === null // true
```

The items parent list, and `null` otherwise.

## Licence

MIT © [Titus Wormer](http://wooorm.com)
