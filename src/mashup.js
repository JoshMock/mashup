'use strict';

var _ = require('lodash');

function mashup () {
    // remove all functions to ensure none get overwritten
    var functions = {};
    var objects = [];
    _.each(arguments, function (obj) {
        _.each(obj, function (value, key) {
            if (_.isFunction(value)) {
                // add function to hash of needed meta-functions
                if (!_.has(functions, key)) {
                    functions[key] = [];
                }
                functions[key].push(value);
            }

            objects.push(obj);
        });
    });

    // create meta-functions
    var metaFns = {};
    _.each(functions, function (value, key) {
        if (value.length === 1) {
            metaFns[key] = value;
        } else {
            // meta-function: run all overlapping named functions, in order, passing down any arguments
            var metaFn = function () {
                var that = this;
                var args = arguments;

                _.each(value, function (fn) {
                    fn.apply(that, args);
                });
            };

            metaFns[key] = metaFn;
        }
    });

    // create full extended object with meta-functions
    return _.extend.apply(_, objects, metaFns);
}

module.exports = mashup;
