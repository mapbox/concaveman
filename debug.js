'use strict';

var fs = require('fs');
var concaveHull = require('./');

var points = require('./tmp/test.json');

var colors = ['#006837', '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#fee08b', '#fdae61', '#f46d43', '#d73027', '#a50026'];
var distStep = 100000;
var numClasses = 10;

var dist = distStep;
var start = 0;
var end = 0;
var hulls = [];

console.time('total');
for (var i = 0, last = []; i < numClasses; i++) {
    start = end;
    while (points[end][2] < dist) end++;

    var now = Date.now();
    var hull = concaveHull(points.slice(start, end).concat(last), 1.5, 0.005, true);
    console.log('concave hull on ' + (end - start + last.length) + ' points in ' +
        (Date.now() - now) + ', size: ' + hull.length);

    hulls.push({
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: last.length ? [hull, last] : [hull]
        },
        properties: {
            stroke: 'black',
            'stroke-opacity': 0.8,
            fill: colors[i],
            'fill-opacity': 0.5
        }
    });

    last = hull;
    dist += distStep;
}
console.timeEnd('total');

var collection = {
    type: 'FeatureCollection',
    features: hulls.reverse()
};

fs.writeFileSync('./tmp/output.json', JSON.stringify(collection));
