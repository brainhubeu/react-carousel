var assert = require('assert');
var immutable = require('immutable');
var serialize = require('remotedev-serialize/immutable/serialize');

var jsan = require('../');

describe('remotedev-serialize', function() {
  it('tests immutable js serialization/deserialization with references', function() {
    var sharedValue = [];
    var record = immutable.Record({
        prop: sharedValue,
    });

    var refs = [record];

    var obj = immutable.Map({
        fst: new record(),
        scnd: new record(),
    });
    var serialized = jsan.stringify(obj, serialize(immutable, refs).replacer, null, true);
    var parsed = JSON.parse(serialized);

    var fstProp = parsed.data.fst.data.prop;
    var scndProp = parsed.data.scnd.data.prop;

    assert.notStrictEqual(fstProp, scndProp);
    assert.ok(scndProp.hasOwnProperty('$jsan') && (typeof scndProp.$jsan === 'string' || parsed.data.scnd.data.prop.$jsan instanceof String));

    var deserialized = jsan.parse(serialized, serialize(immutable, refs).reviver);
    assert.ok(Array.isArray(deserialized.get('scnd').get('prop')), 'deserialized structure has unresolved references');
  });
});
