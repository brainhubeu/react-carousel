var assert = require('assert')
var _db = require('../src')

// Test lodash-id against Undersocre and Lo-Dash
var libs = {
  underscore: require('underscore'),
  lodash: require('lodash')
}

Object.keys(libs).forEach(function (name) {
  describe(name + ' + lodash-id', function () {
    var db
    var _ = libs[name]

    beforeEach(function () {
      _.mixin(_db)
      db = {
        posts: [
          { id: 1, body: 'one', published: true },
          { id: 2, body: 'two', published: false },
          { id: 3, body: 'three', published: false }
        ],
        comments: [
          { id: 1, body: 'foo', postId: 1 },
          { id: 2, body: 'bar', postId: 2 }
        ],
        authors: [
          { id: '1', name: 'foo' },
          { id: '2', name: 'bar' }
        ]
      }
    })

    describe('id', function () {
      beforeEach(function () { _.id = 'body' })
      afterEach(function () { delete _.id })

      it('is the property used by get to find document', function () {
        var expect = db.posts[0]
        var doc = _.getById(db.posts, 'one')

        assert.deepEqual(doc, expect)
      })
    })

    describe('createId', function () {
      it('returns an id', function () {
        assert(_.createId())
      })
    })

    describe('getById', function () {
      it('returns doc by id', function () {
        var expect = db.posts[0]
        var doc = _.getById(db.posts, 1)

        assert.deepEqual(doc, expect)
      })

      it('returns doc by id with string param', function () {
        var expect = db.posts[0]
        var doc = _.getById(db.posts, '1')

        assert.deepEqual(doc, expect)
      })

      it('returns doc by id with string id', function () {
        var expect = db.authors[0]
        var doc = _.getById(db.authors, 1)

        assert.deepEqual(doc, expect)
      })

      it('returns undefined if doc is not found', function () {
        var doc = _.getById(db.posts, 9999)

        assert.equal(doc, undefined)
      })
    })

    describe('insert', function () {
      describe('and id is set', function () {
        it('inserts and returns inserted doc', function () {
          var doc = _.insert(db.posts, { id: 'foo', body: 'one' })

          assert.equal(db.posts.length, 4)
          assert.deepEqual(doc, { id: 'foo', body: 'one' })
          assert.deepEqual(_.getById(db.posts, doc.id), { id: 'foo', body: 'one' })
        })

        it('does not replace in place and throws an error', function () {
          var length = db.posts.length

          assert.throws(function () {
            _.insert(db.posts, { id: 2, title: 'one' })
          }, /duplicate/)
          assert.equal(db.posts.length, length)
          assert.deepEqual(_.getById(db.posts, 2), { id: 2, body: 'two', published: false })
          assert.deepEqual(_.map(db.posts, 'id'), [ 1, 2, 3 ])
        })
      })

      describe('and id is not set', function () {
        it('inserts, sets an id and returns inserted doc', function () {
          var doc = _.insert(db.posts, { body: 'one' })

          assert.equal(db.posts.length, 4)
          assert(doc.id)
          assert.equal(doc.body, 'one')
        })
      })
    })

    describe('upsert', function () {
      describe('and id is set', function () {
        it('inserts and returns inserted doc', function () {
          var doc = _.upsert(db.posts, { id: 'foo', body: 'one' })

          assert.equal(db.posts.length, 4)
          assert.deepEqual(doc, { id: 'foo', body: 'one' })
          assert.deepEqual(_.getById(db.posts, doc.id), { id: 'foo', body: 'one' })
        })

        it('replaces in place and returns inserted doc', function () {
          var length = db.posts.length
          var doc = _.upsert(db.posts, {id: 2, title: 'one'})

          assert.equal(db.posts.length, length)
          assert.deepEqual(doc, { id: 2, title: 'one' })
          assert.deepEqual(_.getById(db.posts, doc.id), { id: 2, title: 'one' })
          assert.deepEqual(_.map(db.posts, 'id'), [1, 2, 3])
        })
      })

      describe('and id is not set', function () {
        it('inserts, sets an id and returns inserted doc', function () {
          var doc = _.upsert(db.posts, {body: 'one'})

          assert.equal(db.posts.length, 4)
          assert(doc.id)
          assert.equal(doc.body, 'one')
        })
      })
    })

    describe('updateById', function () {
      it('updates doc and returns updated doc', function () {
        var doc = _.updateById(db.posts, 1, { published: false })

        assert(!db.posts[0].published)
        assert(!doc.published)
      })

      it('keeps initial id type', function () {
        var doc = _.updateById(db.posts, '1', { published: false })

        assert.strictEqual(doc.id, 1)
      })

      it('returns undefined if doc is not found', function () {
        var doc = _.updateById(db.posts, 9999, { published: false })

        assert.equal(doc, undefined)
      })
    })

    describe('updateWhere', function () {
      it('updates docs and returns updated docs', function () {
        var docs = _.updateWhere(db.posts, { published: false }, { published: true })

        assert.equal(docs.length, 2)
        assert(db.posts[1].published)
        assert(db.posts[2].published)
      })

      it('returns an empty array if no docs match', function () {
        var docs = _.updateWhere(db.posts, { published: 'draft' }, { published: true })

        assert.equal(docs.length, 0)
      })
    })

    describe('replaceById', function () {
      it('replaces doc and returns it', function () {
        var doc = _.replaceById(db.posts, 1, { foo: 'bar' })

        assert.deepEqual(doc, db.posts[0])
        assert.deepEqual(db.posts[0], { id: 1, foo: 'bar' })
      })

      it('keeps initial id type', function () {
        var doc = _.replaceById(db.posts, '1', { published: false })

        assert.strictEqual(doc.id, 1)
      })

      it('returns undefined if doc is not found', function () {
        var doc = _.replaceById(db.posts, 9999, {})

        assert.equal(doc, undefined)
      })
    })

    describe('removeById', function () {
      it('removes and returns doc ', function () {
        var expected = db.posts[0]
        var doc = _.removeById(db.posts, 1)

        assert.equal(db.posts.length, 2)
        assert.deepEqual(doc, expected)
      })

      it('returns undefined if doc is not found', function () {
        var doc = _.removeById(db.posts, 9999)

        assert.equal(doc, undefined)
      })
    })

    describe('removeWhere', function () {
      it('removes docs', function () {
        var expected = [db.comments[0]]
        var docs = _.removeWhere(db.comments, { postId: 1 })

        assert.equal(db.comments.length, 1)
        assert.deepEqual(docs, expected)
      })

      it('returns an empty array if no docs match', function () {
        var docs = _.removeWhere(db.comments, { postId: 9999 })

        assert.equal(docs.length, 0)
      })
    })
  })
})
