# Mashup

Manage object mixins without destroying functions with naming collisions.

In other words, `_.extend` except all functions on all the combined objects
always stay intact.

## Huh?

Say you have an object. Any object will do. How about this one?

```javascript
var myObject = {
    render: function () {
        $('#some-div').show();
    }
};
```

Then say you want to mix in some generic functionality that you reuse
a lot. Maybe you want a mixin to log all render activity to the console.
I don't know why you'd need this, but stay with me. Here's your mixin object:

```javascript
var logMixin = {
    render: function () {
        console.log('rendering!', this);
    }
};
```

If you use Underscore or Lodash, normally you combine objects using
`_.extend`. The problem is that, if you do `myObject = _.extend(myObject, logMixin)`
here, `myObject` is going to have its `render` function overwritten and lost.
We don't want that. That's where mashup comes in:

```javascript
var mixin = require('mixin');
myObject = mixin(myObject, logMixin);
```

Now, if I ran `myObject.render()`, the original function that shows `#some-div`
still runs, but so does the `console.log`! Magic!

And it works like `_.extend` and lets you provide as many objects as you
want! (The only way it doesn't work like `_.extend` is that it doesn't ever
alter the first argument passed. Minor detail.)

```javascript
var bannerAds = {
    onLoad: function () {
        $('#banner').show();
    }
};

var logMixin = {
    onLoad: function () {
        console.log('onLoad ran', this, arguments);
    }
};

var pubsubMixin = function () {
    onLoad: function () {
        pubsub.publish('banner-loaded');
    }
};

var someOtherMixin = function () {
    doStuff: function () {
        console.log('doing stuff');
    },
    onLoad: function () {
        this.doStuff();
    }
};

var mixin = require('mixin');
bannerAds = mixin(bannerAds, logMixin, pubsubMixin, someOtherMixin);
bannerAds.onLoad(); // runs all the onLoad functions!
```

That's it! Enjoy!
