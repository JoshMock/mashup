describe('mashup', function () {
    var mashup = require('../src/mashup');
    var assert = require('assert');
    var sinon = require('sinon');

    it('should add all nonexistent properties from the second object into the first object', function () {
        var obj1 = {
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        };
        var obj2 = {
            bat: 'bat',
            biz: 'biz'
        };

        var result = mashup(obj1, obj2);

        assert.deepEqual(result, {
            foo: 'foo',
            bar: 'bar',
            baz: 'baz',
            bat: 'bat',
            biz: 'biz'
        });
    });

    it('should overwrite any non-function properties in the second object into the first object', function () {
        var obj1 = {
            a: 'aaa',
            b: 'bbb',
            c: 'ccc'
        };
        var obj2 = {
            b: 'zzz',
            c: 'ddd',
            d: 'aaa'
        };

        var result = mashup(obj1, obj2);

        assert.deepEqual(result, {
            a: 'aaa',
            b: 'zzz',
            c: 'ddd',
            d: 'aaa'
        });
    });

    it("should add any function properties in the second object that aren't in the first", function () {
        var fn1 = function () { return 'foobar'; };
        var fn2 = function () { return 'bazbat'; };
        var obj1 = {
            a: 'aaa',
            b: 'bbb'
        };
        var obj2 = {
            c: fn1,
            d: fn2
        };

        var result = mashup(obj1, obj2);

        assert.deepEqual(result, {
            a: 'aaa',
            b: 'bbb',
            c: fn1,
            d: fn2
        });
    });

    it('should wrap any function properties that exist in both so they both run', function () {
        var obj1 = { a: sinon.spy() };
        var obj2 = { a: sinon.spy() };

        var result = mashup(obj1, obj2);
        result.a('foobar');

        assert.ok(obj1.a.calledOnce);
        assert.ok(obj1.a.calledWith('foobar'));
        assert.ok(obj2.a.calledOnce);
        assert.ok(obj2.a.calledWith('foobar'));
    });

    it('should apply all the above rules to an infinite number of arguments', function () {
        var obj1 = { a: 'aaa', c: sinon.spy() };
        var obj2 = { a: 'aaaa', b: 'bbb' };
        var obj3 = { c: sinon.spy() };
        var obj4 = { d: sinon.spy() };

        var result = mashup(obj1, obj2, obj3, obj4);

        assert.equal(result.a, 'aaaa');
        assert.equal(result.b, 'bbb');

        result.c('asd', 'def');
        assert.ok(obj1.c.calledOnce);
        assert.ok(obj1.c.calledWith('asd', 'def'));
        assert.ok(obj3.c.calledOnce);
        assert.ok(obj3.c.calledWith('asd', 'def'));

        assert.equal(result.d, obj4.d);
    });
});
