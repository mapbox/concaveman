'use strict';

var test = require('tape').test;
var concaveman = require('../');

var points = require('./fixtures/points-1k.json');
var hull = require('./fixtures/points-1k-hull.json');
var hull2 = require('./fixtures/points-1k-hull2.json');

test('default concave hull', function (t) {
    var result = concaveman(points);
    t.deepEqual(result, hull);
    t.end();
});

test('tuned concave hull', function (t) {
    var result = concaveman(points, 3, 0.01);
    t.deepEqual(result, hull2);
    t.end();
});
